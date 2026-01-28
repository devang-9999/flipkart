"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";


interface PlaceOrderPayload {
  address: string;
  phoneNumber: string;
  paymentMethod: "COD" | "ONLINE";
}

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  address: string;
  phoneNumber: string;
  paymentStatus: string;
  deliveryStatus: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrderState {
  loading: boolean;
  orders: Order[];
}



const initialState: OrderState = {
  loading: false,
  orders: [],
};



export const placeOrderThunk = createAsyncThunk(
  "order/place",
  async (data: PlaceOrderPayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${API_URL}/orders`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);

export const getMyOrdersThunk = createAsyncThunk<Order[]>(
  "order/getMyOrders",
  async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); 
      })
      .addCase(placeOrderThunk.rejected, (state) => {
        state.loading = false;
      })

 
      .addCase(getMyOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrdersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
