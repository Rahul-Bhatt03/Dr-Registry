import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchFollowUps = createAsyncThunk(
  'followUps/fetchFollowUps',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/Generic/GetAllFollowUps`
    );
    return response.data;
  }
);
  

const genericSlice = createSlice({
  name: 'generic',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowUps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default genericSlice.reducer;
