import { configureStore } from "@reduxjs/toolkit";
import { myReducer } from "./myReducer";

const store = configureStore({
    reducer: {
        myReducer
    },
});

export default store;