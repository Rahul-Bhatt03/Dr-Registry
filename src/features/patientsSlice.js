import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL for the API
const BASE_URL = 'https://164.68.118.52:82/api';

// Async thunk to fetch all patients
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/DrRegistry/GetAll`, {
        params: { patientId:'' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to fetch patient data by ID
export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async ({ patientInfoId }, { rejectWithValue }) => {
    try {
      console.log("patientInfoid",patientInfoId)
      // The URL for fetching a specific patient by ID
      const response = await axios.get(`${BASE_URL}/DrRegistry/GetAll`, {
        params: { patientId: patientInfoId } // patientId passed as a parameter
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Slice for patient management
const patientsSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    patientData: {}, 
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPatientById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patientData = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default patientsSlice.reducer;
