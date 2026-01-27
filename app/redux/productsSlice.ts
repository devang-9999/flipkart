"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

const API_URL = "http://localhost:5000";

interface ProductsPayload {
   name: string,
    description:string,
    category: string,
    price: number,
    stock:number,
    brand:string,
    images:string[],
}

interface ProductsState {
  data: [];
  productDetail: ProductsPayload | null;
  loading: boolean;
  error: string | null;
  total: number;
}

interface FetchProductsParams {
  page: number;
  limit: number;
  searchTerm?: string;
  category?: string;
}

const initialState: ProductsState = {
  data: [],
  productDetail:null,
  loading: false,
  error: null,
  total: 0,
};


export const fetchProductsThunk = createAsyncThunk(
  'products/fetch',
  async (
    {
      page = 1,
      limit = 20,
      category,
      searchTerm,
    }: {
      page?: number;
      limit?: number;
      category?: string;
      searchTerm?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      let url = '';
      const params: FetchProductsParams = {
        page,
        limit,
      };

      if (searchTerm && searchTerm.trim()) {
        url = 'http://localhost:5000/products/searchInput';
        params.searchTerm = searchTerm.trim();
      }

        else if (category) {
          url = 'http://localhost:5000/products/by-category';
          params.category = category.trim().toUpperCase();
        }

      else {
        url = 'http://localhost:5000/products';
      }

      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch products'
        );
      }
      return rejectWithValue('Unexpected error occurred');
    }
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch product'
        );
      }
      return rejectWithValue('Unexpected error occurred');
    }
  }
);

// export const searchProductsByNameThunk = createAsyncThunk(
//   'products/search',
//   async (
//     {
//       searchTerm,
//       page = 1,
//       limit = 14,
//     }: {
//       searchTerm: string;
//       page?: number;
//       limit?: number;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const encodedSearchTerm = encodeURIComponent(searchTerm.trim());

//       const response = await axios.get(
//         `http://localhost:5000/products/searchInput`,
//         {
//           params: {
//             searchTerm: encodedSearchTerm,
//             page,
//             limit,
//           },
//         }
//       );

//       return response.data;
//     } catch (error ) {
//        const err = error as AxiosError;
//       return rejectWithValue(
//         err.response?.data || 'Failed to search products'
//       );
//     }
//   }
// );


export const addProductThunk = createAsyncThunk(
  "products",
  async (formData: ProductsPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/products`, formData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to add product");
      }
      return rejectWithValue("An unexpected error occurred");
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
        state.error=null; //not neccessarily important
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) 
      
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true;
        state.productDetail = null; //not neccessarily important
        state.error=null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload

      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
