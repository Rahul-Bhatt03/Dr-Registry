import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to update fundus examination
export const updateFundusExamination = createAsyncThunk(
  "fundusExamination/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/updateFundusExamination`,
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

// Async thunk to add fundus examination
export const addFundusExamination = createAsyncThunk(
  "fundusExamination/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addFundusExamination`,
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
const fundusExaminationSlice = createSlice({
  name: "fundusExamination",
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
    // Update Fundus Examination
    builder.addCase(updateFundusExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateFundusExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateFundusExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Fundus Examination
    builder.addCase(addFundusExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addFundusExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addFundusExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = fundusExaminationSlice.actions;

export default fundusExaminationSlice.reducer;
