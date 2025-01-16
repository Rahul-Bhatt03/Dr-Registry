import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Fetch token from local storage
const getAuthToken = () => localStorage.getItem("token");

// Async thunk to update external examination
export const updateExternalExamination = createAsyncThunk(
  "externalExamination/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/updateExternalExamination`,
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

// Async thunk to add external examination
export const addExternalExamination = createAsyncThunk(
  "externalExamination/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addExternalExamination`,
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
const externalExaminationSlice = createSlice({
  name: "externalExamination",
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
    // Update External Examination
    builder.addCase(updateExternalExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExternalExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateExternalExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add External Examination
    builder.addCase(addExternalExamination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addExternalExamination.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addExternalExamination.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = externalExaminationSlice.actions;

export default externalExaminationSlice.reducer;
