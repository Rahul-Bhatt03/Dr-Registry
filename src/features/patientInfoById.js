import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Async thunk to fetch patient information
export const fetchPatientInfo = createAsyncThunk(
  'patientInfo/fetchPatientInfo',
  async (patientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Fetch token from localStorage
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await axios.get(
        `${BASE_URL}/PatientInfo/getinfo/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Reject with error message for handling in extraReducers
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const patientInfoSlice = createSlice({
  name: 'patientInfo',
  initialState: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearPatientInfo: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatientInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPatientInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearPatientInfo } = patientInfoSlice.actions;

export default patientInfoSlice.reducer;
