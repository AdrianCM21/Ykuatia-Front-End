import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import error422Reducer from './error422Slice'
// import facturaReducer from './invoices/invoiceSlice'
// import { checkInvoicesMiddleware } from "../middleware/checkInvoicesMiddleware";

const storeTemp: EnhancedStore = configureStore({
    reducer:{
        error422:error422Reducer,
        // factura: facturaReducer
    }});

export type RootState = ReturnType<typeof storeTemp.getState>;

export const store: EnhancedStore<RootState> = storeTemp;