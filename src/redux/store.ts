import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import error422Reducer from './error422Slice'
import accessGlobalReducer from "./accessSistem/accessSistemSlice";
// import facturaReducer from './invoices/invoiceSlice'
// import { checkInvoicesMiddleware } from "../middleware/checkInvoicesMiddleware";

const storeTemp: EnhancedStore = configureStore({
    reducer:{
        error422:error422Reducer,
        accessGlobal: accessGlobalReducer
    }});

export type RootState = ReturnType<typeof storeTemp.getState>;

export const store: EnhancedStore<RootState> = storeTemp;