"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

const API_URL = "http://localhost:5000";

interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (
    data: { productId: number; quantity: number },
    { getState }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const res = await axios.post(
      `${API_URL}/cart`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
);

export const getMyCartThunk = createAsyncThunk(
  "cart/get",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const res = await axios.get(`${API_URL}/cart/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);

export const removeItemThunk = createAsyncThunk(
  "cart/remove",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const res = await axios.delete(
      `${API_URL}/cart/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyCartThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(removeItemThunk.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
