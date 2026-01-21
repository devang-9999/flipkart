// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from './store';

// interface User {
//   username: string;
//   email: string;
//   password:string;
// }

// interface UsersState {
//   currentUser : user | null;
//   error: string | null;
//   loading : boolean;
//   isLoggedIn:boolean;
// }

// const initialState: UsersState = {
//   currentUser : null,
//   error: null,
//   loading : false,
//   isLoggedIn:false
// };

// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (id:string,{rejectWithValue}) => {
//     try{
    
//     }
//   }
   
// );

// export const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
//         state.status = 'succeeded';
//         state.users = action.payload; 
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Something went wrong';
//       });
//   },
// });

// export default usersSlice.reducer;

// export const selectAllUsers = (state: RootState) => state.users.users;
