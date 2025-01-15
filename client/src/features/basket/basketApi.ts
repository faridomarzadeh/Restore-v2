import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";

export const BasketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket,void>({
            query: () => 'basket',
            providesTags: ['Basket']
        }),
        addItemsToBasket : builder.mutation<Basket,{product:Product,quantity:number}>({
            query: ({product, quantity}) => ({
                url: `basket?productId=${product.id}&quantity=${quantity}`,
                method: 'POST'
            }),
            //invalidate the cache for getting basket
            onQueryStarted: async({product,quantity},{queryFulfilled,dispatch}) => {

                const result = dispatch(BasketApi.util.updateQueryData('fetchBasket', undefined, (draft)=>{
                    const existingItem = draft.items.find(p=>p.productId==product.id);
                    if(existingItem) existingItem.quantity+=quantity;
                    else draft.items.push(new Item(product,quantity));
                }))

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    result.undo();
                }
            }
        }),
        removeItemsFromBasket: builder.mutation<void,{productId: number, quantity:number}>({
            query: ({productId,quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE'
            }),
            onQueryStarted: async ({productId,quantity},{queryFulfilled,dispatch}) => {
                
                const result = dispatch(BasketApi.util.updateQueryData('fetchBasket',undefined, (draft)=> {
                    const itemIndex = draft.items.findIndex(item => item.productId===productId);
                    if(draft.items[itemIndex]){
                        draft.items[itemIndex].quantity -= quantity;
                        if(draft.items[itemIndex].quantity <= 0)
                        {
                            draft.items.splice(itemIndex,1);
                        }
                    }
                }));

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    result.undo();
                }
            }
        })
    })
})

export const { 
    useFetchBasketQuery,
    useAddItemsToBasketMutation,
    useRemoveItemsFromBasketMutation
 } = BasketApi;