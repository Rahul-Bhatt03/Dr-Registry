// features/systemicComplicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Async thunk to fetch complications data
export const fetchSystemicComplications = createAsyncThunk(
  'systemicComplications/fetchSystemicComplications',
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllSystemicOtherComplications`);
    return response.data; 
  }
);

const systemicComplicationsSlice = createSlice({
  name: 'systemicComplications',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemicComplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemicComplications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSystemicComplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default systemicComplicationsSlice.reducer;
