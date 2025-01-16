import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Helper function to get token
const getToken = () => localStorage.getItem('token');

// Async thunk for updating ocular history
export const updateOcularHistory = createAsyncThunk(
  'ocularHistory/updateOcularHistory',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/updateOcularHistory`,
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

// Async thunk for adding ocular history
export const addOcularHistory = createAsyncThunk(
  'ocularHistory/addOcularHistory',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addOcularHistory`,
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
  ocularHistory: [],
  loading: false,
  error: null,
};

const ocularHistorySlice = createSlice({
  name: 'ocularHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Update ocular history
      .addCase(updateOcularHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOcularHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.ocularHistory = state.ocularHistory.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateOcularHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add ocular history
      .addCase(addOcularHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOcularHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.ocularHistory.push(action.payload);
      })
      .addCase(addOcularHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ocularHistorySlice.reducer;
