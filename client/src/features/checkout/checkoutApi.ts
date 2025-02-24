import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket } from "../../app/models/basket";
import { BasketApi } from "../basket/basketApi";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) =>({

        createPaymentIntent : builder.mutation<Basket, void>({
            query: () => {return {url: 'payments', method: 'POST'}},
            onQueryStarted : async(_, {dispatch, queryFulfilled}) => {                
                try {
                    const {data} = await queryFulfilled;

                    dispatch(
                        BasketApi.util.updateQueryData('fetchBasket',undefined, (draft) => {
                            draft.clientSecret = data.clientSecret;
                        })
                    )

                } catch (error) {
                    console.log("payment intent creation failed :"+error);
                    
                }
            }
        })
    })
})

export const { useCreatePaymentIntentMutation } = checkoutApi;