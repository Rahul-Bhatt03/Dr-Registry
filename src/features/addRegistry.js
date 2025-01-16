import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

export const addRegistry = createAsyncThunk(
  "registry/addRegistry",
  async (registryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axios.post(
        `${BASE_URL}/RegistryInfo/addRegistry`,
        registryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add registry" }
      );
    }
  }
);

const registrySlice = createSlice({
  name: "registry",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRegistry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRegistry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addRegistry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registrySlice.reducer;