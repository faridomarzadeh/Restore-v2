import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket } from "../../app/models/basket";

export const BasketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket,void>({
            query: () => 'basket'
        }),
        addItemsToBasket : builder.mutation<Basket,{productId:number,quantity:number}>({
            query: ({productId,quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'POST'
            })
        }),
        removeItemsFromBasket: builder.mutation<void,{productId: number, quantity:number}>({
            query: ({productId,quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE'
            })
        })
    })
})

export const { 
    useFetchBasketQuery,
    useAddItemsToBasketMutation,
    useRemoveItemsFromBasketMutation
 } = BasketApi;