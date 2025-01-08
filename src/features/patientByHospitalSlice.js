import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Define the async thunk for fetching patients by hospital ID
export const fetchPatientsByHospital = createAsyncThunk(
  'patientsByHospital/fetchPatientsByHospital',
  async (hospitalId, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}$/DrRegistry/GetAll?hospitalId=${hospitalId}`);
      return response.data; // Return the patient data from the response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  patients: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const patientByHospitalSlice = createSlice({
  name: 'patientsByHospital',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientsByHospital.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientsByHospital.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload; // Here we assume the response data is the list of patients
      })
      .addCase(fetchPatientsByHospital.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default patientByHospitalSlice.reducer;
