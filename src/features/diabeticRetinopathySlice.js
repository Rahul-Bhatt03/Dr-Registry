import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to update diabetic retinopathy
export const updateDiabeticRetinopathy = createAsyncThunk(
  "diabeticRetinopathy/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/updateDiabeticRetinopathy`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add diabetic retinopathy
export const addDiabeticRetinopathy = createAsyncThunk(
  "diabeticRetinopathy/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addDiabeticRetinopathy`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Redux slice
const diabeticRetinopathySlice = createSlice({
  name: "diabeticRetinopathy",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update Diabetic Retinopathy
    builder.addCase(updateDiabeticRetinopathy.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDiabeticRetinopathy.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateDiabeticRetinopathy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Diabetic Retinopathy
    builder.addCase(addDiabeticRetinopathy.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addDiabeticRetinopathy.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addDiabeticRetinopathy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = diabeticRetinopathySlice.actions;

export default diabeticRetinopathySlice.reducer;
