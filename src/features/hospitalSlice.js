import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchHospitals = createAsyncThunk(
  'hospitals/fetchHospitals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/HospitalInfo/GetAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState: {
    hospitals: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default hospitalSlice.reducer;