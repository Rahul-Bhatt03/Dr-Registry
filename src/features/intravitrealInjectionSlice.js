import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchIntravitrealInjectionTypes = createAsyncThunk(
  'intravitrealInjection/fetchTypes',
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllIntravitrealInjectionTypes`);
    return response.data;
  }
);

const intravitrealInjectionSlice = createSlice({
  name: 'intravitrealInjection',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntravitrealInjectionTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIntravitrealInjectionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIntravitrealInjectionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default intravitrealInjectionSlice.reducer;
