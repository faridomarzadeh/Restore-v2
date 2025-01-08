import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";


export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        getProducts: builder.query<Product[],void>({
            query: () => 'products'
        }),
        getProduct: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        })
    })
})

export const { useGetProductQuery, useGetProductsQuery } = catalogApi;