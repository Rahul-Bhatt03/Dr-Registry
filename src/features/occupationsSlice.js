// src/features/occupationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from './endPoints';

export const fetchOccupations = createAsyncThunk(
  'occupations/fetchOccupations',
  async () => {
    const response = await fetch(`${BASE_URL}/Generic/GetAllOccupations`);
    const data = await response.json();
    return data;
  }
);

const occupationsSlice = createSlice({
  name: 'occupations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOccupations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default occupationsSlice.reducer;
