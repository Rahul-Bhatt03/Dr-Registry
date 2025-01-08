import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints.js';

export const fetchSurgeryTypes = createAsyncThunk(
  'surgery/fetchSurgeryTypes',
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllSurgeryTypes`);
    return response.data; // Assumes data is an array of surgery types
  }
);

const surgerySlice = createSlice({
  name: 'surgery',
  initialState: {
    types: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurgeryTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurgeryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchSurgeryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default surgerySlice.reducer;
