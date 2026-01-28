"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice"
import orderReducer from "./orderSlice"
import adminReducer from "./adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
     products: productsReducer,
     cart:cartReducer,
     order:orderReducer,
     admin:adminReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
