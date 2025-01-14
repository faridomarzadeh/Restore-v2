import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../../routes/Routes";

type ErrorsDataType = string | { title: string } | { errors: object }
const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api',
    credentials: 'include'
})

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    api.dispatch(startLoading());
    
    await sleep();
    const result = await customBaseQuery(args,api,extraOptions);

    api.dispatch(stopLoading());

    if(result.error){
        const responseData = result.error.data as ErrorsDataType;
        const status = result.error.status ==='PARSING_ERROR' && result.error.originalStatus ?
        result.error.originalStatus : result.error.status;
        
        switch (status) {
            case 400:
                if(typeof(responseData)==='string')
                    toast.error(responseData);
                else if('errors' in responseData)
                    throw Object.values(responseData.errors).flat().join('; ');
                    
                else
                    toast.error(responseData.title);
                break;
            
            case 401:
                if(typeof(responseData)==='object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            case 404:
                if(typeof(responseData)==='object' && 'title' in responseData)
                    router.navigate('/not-found');
                break;
            case 500:
                if(typeof(responseData)==='object' )                    
                    router.navigate('/server-error', {state: {error: responseData}})
                break;
            default:
                break;
        }
    }

    return result;
}