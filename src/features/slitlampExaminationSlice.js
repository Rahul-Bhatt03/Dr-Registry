import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to update slitlamp examination
export const updateSlitlampExamination = createAsyncThunk(
  "slitlampExamination/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/updateSlitlampExamination`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add slitlamp examination
export const addSlitlampExamination = createAsyncThunk(
  "slitlampExamination/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addSlitlampExamination`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
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
const slitlampExaminationSlice = createSlice({
  name: "slitlampExamination",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update Slitlamp Examination
    builder.addCase(updateSlitlampExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSlitlampExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateSlitlampExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Slitlamp Examination
    builder.addCase(addSlitlampExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addSlitlampExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addSlitlampExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = slitlampExaminationSlice.actions;

export default slitlampExaminationSlice.reducer;
