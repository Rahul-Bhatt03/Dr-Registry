import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Helper function to get token
const getToken = () => localStorage.getItem('token');

// Async thunk for updating investigation
export const updateInvestigation = createAsyncThunk(
  'investigations/updateInvestigation',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/UpdateInvestigation`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding investigation
export const addInvestigation = createAsyncThunk(
  'investigations/addInvestigation',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addInvestigation`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  investigations: [],
  loading: false,
  error: null,
};

const investigationSlice = createSlice({
  name: 'investigations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Update investigation
      .addCase(updateInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = state.investigations.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add investigation
      .addCase(addInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations.push(action.payload);
      })
      .addCase(addInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default investigationSlice.reducer;
