import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

// Async thunk for updating DrRegistry info
export const updateDrRegistryInfo = createAsyncThunk(
  "drRegistry/updateDrRegistryInfo",
  async ({ registryData }, { rejectWithValue }) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      const response = await axios.post(
        `${BASE_URL}/DrRegistry/updateDrRegistryInfo`,
        registryData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      // Check for unauthorized error
      if (error.response?.status === 401) {
        // Handle the unauthorized error, possibly prompt for re-login
        return rejectWithValue({
          message: "Unauthorized. Please log in again.",
          code: 401,
        });
      }
      // Handle other errors
      return rejectWithValue(
        error.response?.data || "An error occurred while updating DrRegistry."
      );
    }
  }
);

const drRegistrySlice = createSlice({
  name: "drRegistry",
  initialState: {
    data: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearDrRegistryState: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDrRegistryInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateDrRegistryInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateDrRegistryInfo.rejected, (state, action) => {
        state.status = "failed";
        // If the error is unauthorized, we handle it differently
        if (action.payload?.code === 401) {
          state.error = action.payload.message;
          // Optionally, redirect to login or take action to re-authenticate
        } else {
          state.error = action.payload;
        }
      });
  },
});

export const { clearDrRegistryState } = drRegistrySlice.actions;

export default drRegistrySlice.reducer;
