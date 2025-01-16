import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to fetch all registry data by patient ID
export const getAllRegistry = createAsyncThunk(
  "registry/getAll",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/RegistryInfo/GetAllRegistry?patientId=${patientId}`,
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
const historySlice = createSlice({
  name: "history",
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
    builder
      // Handle getAllRegistry
      .addCase(getAllRegistry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRegistry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllRegistry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = historySlice.actions;

export default historySlice.reducer;
