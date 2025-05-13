import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./Slices/AppSlice";

const store = configureStore({
    reducer: {
        AppData: AppReducer
    }
})

export default store;