import { configureStore } from "@reduxjs/toolkit";
import error422Reducer from './error422Slice'

const store = configureStore({
    reducer:{
        error422:error422Reducer
    },
})
export {store}