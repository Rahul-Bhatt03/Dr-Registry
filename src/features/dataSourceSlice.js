import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to add a data source
export const addDataSource = createAsyncThunk(
  "dataSource/add",
  async (dataSourcePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addDataSource`,
        dataSourcePayload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update a data source
export const updateDataSource = createAsyncThunk(
  "dataSource/update",
  async (updatePayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/RegistryInfo/updateDataSource`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
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
const dataSourceSlice = createSlice({
  name: "dataSource",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addDataSource
      .addCase(addDataSource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addDataSource.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addDataSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateDataSource
      .addCase(updateDataSource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDataSource.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateDataSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = dataSourceSlice.actions;

export default dataSourceSlice.reducer;
