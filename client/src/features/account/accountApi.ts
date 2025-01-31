import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { User } from "../../app/models/user";
import { LoginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../routes/Routes";
import { toast } from "react-toastify";
import { RegisterSchema } from "../../lib/schemas/registerSchema";

export const AccountApi = createApi({
    reducerPath: 'acountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],
    endpoints: (builder ) => ({
        login: builder.mutation<void, LoginSchema>({
            query: (creds) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            },
            onQueryStarted: async (_, {queryFulfilled, dispatch}) => {
                try {
                    await queryFulfilled;
                    dispatch(AccountApi.util.invalidateTags(['UserInfo']))
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }),
        register: builder.mutation<void,RegisterSchema>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            },
            onQueryStarted: async(_, {queryFulfilled}) => {

                try {
                    await queryFulfilled;
                    toast.success('registeration successful - you can now sign in')
                    router.navigate('/login')
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            }
        }),
        userInfo: builder.query<User,void>({
            query: () => 'account/user-info',
            providesTags: ['UserInfo']
        }),
        logout: builder.mutation({
            query: () => {
                return {
                    url: 'account/logout',
                    method: 'POST'
                }
            },
            onQueryStarted: async(_,{queryFulfilled, dispatch}) => {

                try {
                    await queryFulfilled;
                    dispatch(AccountApi.util.invalidateTags(['UserInfo']));
                    router.navigate('/');
                } catch (error) {
                    console.log(error);
                    
                }
            }
        })
    })
})


export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLogoutMutation, useLazyUserInfoQuery} = AccountApi;