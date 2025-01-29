import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { User } from "../../app/models/user";

export const AccountApi = createApi({
    reducerPath: 'acountApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder ) => ({
        login: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            }
        }),
        register: builder.mutation<void,object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            }
        }),
        userInfo: builder.query<User,void>({
            query: () => 'account/user-info'
        }),
        logout: builder.mutation({
            query: () => {
                return {
                    url: 'account/logout',
                    method: 'POST'
                }
            }
        })
    })
})


export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLogoutMutation} = AccountApi;