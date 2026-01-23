"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

const API_URL = "http://localhost:3001/products";

interface ProductsState {
  data: [];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchProductsThunk = createAsyncThunk(
  "products/fetch",
  async (
    params: { page?: number; limit?: number; category?: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      let url = `${API_URL}?page=${params.page || 1}&limit=${params.limit || 20}`;

      if (params.category) {
        url = `${API_URL}/search?category=${params.category}&page=${params.page || 1}&limit=${params.limit || 20}`;
      }

      if (params.name) {
        url += `&name=${params.name}`;
      }

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
