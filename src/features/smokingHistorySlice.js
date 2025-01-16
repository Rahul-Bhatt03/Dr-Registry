import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// API endpoint URL
const API_URL = `${BASE_URL}/RegistryInfo/addSmokingHistory`;

// Async thunk to handle the POST request to the API
export const addSmokingHistory = createAsyncThunk(
  'smokingHistory/addSmokingHistory',
  async (smokingHistoryData, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the API call with Authorization header
      const response = await axios.post(API_URL, smokingHistoryData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Something went wrong');
    }
  }
);

// Initial state for smoking history
const initialState = {
  smokingHistory: null,
  loading: false,
  error: null,
};

// Redux slice
const smokingHistorySlice = createSlice({
  name: 'smokingHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSmokingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSmokingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.smokingHistory = action.payload;
        state.error = null;
      })
      .addCase(addSmokingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add smoking history';
      });
  },
});

// Export the reducer to be used in the store
export default smokingHistorySlice.reducer;
