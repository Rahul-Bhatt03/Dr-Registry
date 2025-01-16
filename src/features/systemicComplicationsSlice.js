
// features/systemicComplicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Async thunk to fetch complications data
export const fetchSystemicComplications = createAsyncThunk(
  'systemicComplications/fetchSystemicComplications',
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllSystemicOtherComplications`);
    return response.data; 
  }
);

// Async thunk to add a systemic complication
export const addSystemicComplication = createAsyncThunk(
  'systemicComplications/addSystemicComplication',
  async (complicationData, { rejectWithValue }) => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem('token');

      // Define headers with Authorization
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Make POST request to the API endpoint
      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addSystemicComplication`,
        complicationData,
        { headers }
      );

      return response.data; // Return the API response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data || 'Something went wrong while adding systemic complication.'
      );
    }
  }
);

const systemicComplicationsSlice = createSlice({
  name: 'systemicComplications',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemicComplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemicComplications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSystemicComplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSystemicComplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSystemicComplication.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add new complication to data
      })
      .addCase(addSystemicComplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default systemicComplicationsSlice.reducer;