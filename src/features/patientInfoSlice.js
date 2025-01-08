import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

// Thunk for adding patient information
export const addPatientInfo = createAsyncThunk(
  "patientInfo/addPatientInfo",
  async (patientData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      const response = await axios.post(
        `${BASE_URL}/PatientInfo/addPatientInfo`,
        patientData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchAllPatients = createAsyncThunk(
  "patientInfo/fetchAllPatients",
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      // Build query string from filters
      const queryParams = new URLSearchParams(filters).toString();

      const response = await axios.get(
        `${BASE_URL}/PatientInfo/GetAll?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


const patientInfoSlice = createSlice({
  name: "patientInfo",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle addPatientInfo
      .addCase(addPatientInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPatientInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addPatientInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchAllPatients
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default patientInfoSlice.reducer;
