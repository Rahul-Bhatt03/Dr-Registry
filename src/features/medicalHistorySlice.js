import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to handle the API call
export const addMedicalHistory = createAsyncThunk(
  'medicalHistory/addMedicalHistory',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      if (!token) {
        throw new Error('Authorization token not found. Please log in.');
      }

      const response = await axios.post(
        'https://164.68.118.52:82/api/RegistryInfo/addMedicalHistory',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Redux slice
const medicalHistorySlice = createSlice({
  name: 'medicalHistory',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMedicalHistory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addMedicalHistory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetState } = medicalHistorySlice.actions;

export default medicalHistorySlice.reducer;
