import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

// Base URL

// Helper to retrieve token from localStorage
const getToken = () => localStorage.getItem('token');

// Axios instance with base configuration
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
});

// Add token to the headers for every request
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Async thunk for fetching states
export const fetchStates = createAsyncThunk(
    'location/fetchStates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/Generic/GetAllStates');
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch states',
                status: error.response?.status,
                details: error.toString(),
            });
        }
    }
);
  
  export const fetchDistricts = createAsyncThunk(
    'location/fetchDistricts',
    async ({ stateId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/Generic/GetAllDistricts?stateId=${stateId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'An unexpected error occurred',
                status: error.response?.status,
                details: error.toString(),
            });
            
            
        }
    }
);

export const fetchMunicipalities = createAsyncThunk(
    'location/fetchMunicipalities',
    async ({ stateId, districtId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/Generic/GetAllMunicipals?stateId=${stateId}&districtId=${districtId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch municipalities');
        }
    }
);


  // Location Slice
const locationSlice = createSlice({
    name: 'location',
    initialState: {
      states: [],
      districts: [],
      municipalities: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // States
        .addCase(fetchStates.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchStates.fulfilled, (state, action) => {
            state.loading = false;
            state.states = action.payload;
        })
        .addCase(fetchStates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'An unexpected error occurred';
        })
    
        // Districts
        .addCase(fetchDistricts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchDistricts.fulfilled, (state, action) => {
          state.loading = false;
          state.districts = action.payload;
        })
        .addCase(fetchDistricts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Municipalities
        .addCase(fetchMunicipalities.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchMunicipalities.fulfilled, (state, action) => {
            state.loading = false;
            state.municipalities = Array.isArray(action.payload) ? action.payload : [];
            console.log("Municipalities loaded:", state.municipalities); // Add this log
          })
        .addCase(fetchMunicipalities.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default locationSlice.reducer;