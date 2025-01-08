import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

export const fetchDiabetesMellitisTypes = createAsyncThunk(
  'generic/fetchDiabetesMellitisTypes',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/Generic/GetAllDiabetesMellitisTypes`
    );
    return response.data;
  }
);

const dTypeSlice = createSlice({
  name: 'dType',
  initialState: {
    diabetesMellitisTypes: [],
    selectedDiabetesTypeId: null, // Store for the selected diabetes type ID
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    setDiabetesTypeId: (state, action) => {
      state.selectedDiabetesTypeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiabetesMellitisTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiabetesMellitisTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.diabetesMellitisTypes = action.payload;
      })
      .addCase(fetchDiabetesMellitisTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setDiabetesTypeId } = dTypeSlice.actions;

export default dTypeSlice.reducer;
