import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchDiabeticRetinopathyTimes = createAsyncThunk(
  'diabeticRetinopathy/fetchTimes',
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllDiabeticRetinopathyTimes`);
    return response.data;
  }
);

const diabeticRetinopathySlice = createSlice({
  name: 'diabeticRetinopathy',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiabeticRetinopathyTimes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiabeticRetinopathyTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDiabeticRetinopathyTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default diabeticRetinopathySlice.reducer;
