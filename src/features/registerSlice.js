import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

// Axios instance with baseURL and Authorization header from localStorage
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Retrieve the token
  console.log('Token used in request:', token); // Log token for debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Async Thunks
export const register = createAsyncThunk(
  "register/user",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Account/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error Details:", error.response);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Slice
const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
