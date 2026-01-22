"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

interface RegisterPayload {
  username: string;
  useremail: string;
  userpassword: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}


const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};


const API_URL = "http://localhost:5000"; 



export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      console.log(res.data)
      return res.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Registration failed"
        );
      }

      return rejectWithValue("Registration failed");
    }
  }
);


export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      return res.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Login failed"
        );
      }

      return rejectWithValue("Login failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(registerUserThunk.fulfilled, (state) => {
  state.loading = false;
  state.success = true;
  state.message = "Registration successful";
})
.addCase(registerUserThunk.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
  state.message = action.payload as string;
})



      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(loginUserThunk.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;
  state.message = "Login successful";
})
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
