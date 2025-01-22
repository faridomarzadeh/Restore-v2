import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import { Pagination as PaginationType} from "../../app/models/pagination";


export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        getProducts: builder.query<{items: Product[], pagination: PaginationType},ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items:Product[], meta) =>{
                const paginationHeader = meta?.response?.headers.get('Pagination');                
                const pagination = paginationHeader? JSON.parse(paginationHeader): null;                
                return {items, pagination}
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