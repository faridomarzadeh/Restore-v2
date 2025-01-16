import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";

function isBasketItem(product: Product | Item) : product is Item
{
    return (product as Item).quantity !==undefined
}

export const BasketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket,void>({
            query: () => 'basket',
            providesTags: ['Basket']
        }),
        addItemsToBasket : builder.mutation<Basket,{product: Product | Item,quantity:number}>({
            query: ({product, quantity}) => {
                const productId = isBasketItem(product)? product.productId:product.id;
                return {
                  url: `basket?productId=${productId}&quantity=${quantity}`,
                  method: 'POST'
                }
            },
            //invalidate the cache for getting basket
            onQueryStarted: async({product,quantity},{queryFulfilled,dispatch}) => {
                let isNewBasket = false;
                const result = dispatch(BasketApi.util.updateQueryData('fetchBasket', undefined, (draft)=>{
                    const productId = isBasketItem(product)? product.productId:product.id;
                    isNewBasket = !draft?.basketId;
                    if(!isNewBasket)
                    {
                    const existingItem = draft.items.find(p=>p.productId==productId);
                    if(existingItem) existingItem.quantity+=quantity;
                    else draft.items.push(isBasketItem(product)? product: {...product, productId:product.id, quantity});
                    }
                }))

                try {
                    await queryFulfilled;
                    if(isNewBasket)
                        dispatch(BasketApi.util.invalidateTags(['Basket']));
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