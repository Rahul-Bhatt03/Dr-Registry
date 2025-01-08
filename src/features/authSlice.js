import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

const initialState = {
  user: null, // Added back to hold user data
  token: localStorage.getItem("token") || null,
  roles: (() => {
    const roles = localStorage.getItem("roles");
    try {
      return roles ? JSON.parse(roles) : null;
    } catch (e) {
      return roles || null;
    }
  })(),
  loading: false,
  error: null,
};

// CreateAsyncThunk for login
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/Account/login`, credentials);
    const { token, roles, user } = response.data;

    // Save token and roles to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("user", JSON.stringify(user));

    return { token, roles, user };
  } catch (error) {
    // Return a detailed error message
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.roles = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
