import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Use the new origin
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token used in request:', token); // Log token for debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async Thunks
export const fetchAdmins = createAsyncThunk('admins/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/Account/getAllUsers');
    return Array.isArray(response.data) ? response.data : response.data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching admins');
  }
});


export const registerAdmin = createAsyncThunk('admins/register', async (adminData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      '/Account/register',
      adminData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error registering admin');
  }
});

// export const fetchDeletedAdmins = createAsyncThunk('admins/fetchDeleted', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get('/api/Admins/deleted');
//     return Array.isArray(response.data) ? response.data : response.data.admins || [];
//   } catch (error) {
//     return rejectWithValue(error.response?.data || 'Error fetching deleted admins');
//   }
// });
// export const deleteAdmin = createAsyncThunk('admins/delete', async (id, { rejectWithValue }) => {
//   try {
//     await axiosInstance.patch(`/api/Admins/delete/${id}`);
//     return id;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || 'Error deleting admin');
//   }
// });
// export const restoreAdmin = createAsyncThunk('admins/restore', async (id, { rejectWithValue }) => {
//   try {
//     await axiosInstance.patch(`/api/Admins/restore/${id}`);
//     return id;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || 'Error restoring admin');
//   }
// });

// Slice
const adminSlice = createSlice({
  name: 'admins',
  initialState: {
    admins: [],
    deletedAdmins: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAdmins.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAdmins.fulfilled, (state, action) => {
      state.admins = action.payload;
      state.status = 'succeeded';
    })
    .addCase(fetchAdmins.rejected, (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    })
    .addCase(registerAdmin.fulfilled, (state, action) => {
      state.admins.push(action.payload);
    });
    // .addCase(fetchDeletedAdmins.fulfilled, (state, action) => {
    //   state.deletedAdmins = action.payload;
    // })
    // .addCase(deleteAdmin.fulfilled, (state, action) => {
      //   state.admins = state.admins.filter((admin) => admin.id !== action.payload);
      // })
      // .addCase(restoreAdmin.fulfilled, (state, action) => {
      //   state.deletedAdmins = state.deletedAdmins.filter((admin) => admin.id !== action.payload);
      // });
  },
});

export default adminSlice.reducer;