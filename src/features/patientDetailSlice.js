import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchPatientDetail = createAsyncThunk(
  'patientDetail/fetchPatientDetail',
  async (patientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${BASE_URL}/DrRegistry/GetAll?patientId=${patientId}`,
        { headers }
      );

      return response.data[0]; // Since the response is an array with single object
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch patient details');
    }
  }
);

const patientDetailSlice = createSlice({
  name: 'patientDetail',
  initialState: {
    patient: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearPatientDetail: (state) => {
      state.patient = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatientDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patient = action.payload ? [action.payload] : []; // Convert single object to array
      })
      .addCase(fetchPatientDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearPatientDetail } = patientDetailSlice.actions;
export default patientDetailSlice.reducer;
