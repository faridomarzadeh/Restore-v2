import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";


export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        getProducts: builder.query<Product[],ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            }
        }),
        getProduct: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
        getFilters: builder.query<{brands: string[],types: string[]},void>({
            query: () => '/products/filters'
        })
    })
})

export const { useGetProductQuery, useGetProductsQuery, useGetFiltersQuery } = catalogApi;