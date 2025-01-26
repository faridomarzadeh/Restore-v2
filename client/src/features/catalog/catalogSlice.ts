import { createSlice } from "@reduxjs/toolkit";
import { ProductParams } from "../../app/models/productParams";

const initialState: ProductParams = {
    orderBy: 'name',
    pageNumber: 1,
    pageSize: 8,
    brands: [],
    types: [],
    searchTerm: ''
}

export const catalogSlice = createSlice({
    name: 'catalogSlice',
    initialState,
    reducers: {
        setPageNumber(state, action) {
            state.pageNumber = action.payload;
        },
        setPageSize(state, action) {
            state.pageSize = action.payload;
        },
        setOrderBy(state, action){
            state.orderBy = action.payload;
            state.pageNumber = 1
        },
        setBrands(state, action){
            state.brands = action.payload;
            state.pageNumber = 1;
        },
        setTypes(state, action){
            state.types = action.payload;
            state.pageNumber = 1
        },
        setSearchTerm(state, action){
            state.searchTerm = action.payload;
            state.pageNumber = 1
        },
        resetParams(){
            return initialState;
        }
    }
})

export const {setBrands, setOrderBy, setPageNumber,
     setPageSize, setSearchTerm, setTypes,resetParams} = catalogSlice.actions;