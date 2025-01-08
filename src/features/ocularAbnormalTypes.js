import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';

// Thunks to fetch abnormal types for optic nerve and retina using axios
export const fetchOpticNerveAbnormalTypes = createAsyncThunk(
  'abnormalTypes/fetchOpticNerveAbnormalTypes',
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Generic/GetAllOpticNerveAbnormalTypes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching optic nerve abnormal types:", error);
      throw error;
    }
  }
);

export const fetchRetinaAbnormalTypes = createAsyncThunk(
  'abnormalTypes/fetchRetinaAbnormalTypes',
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Generic/GetAllRetinaAbnormalTypes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching retina abnormal types:", error);
      throw error;
    }
  }
);

const abnormalTypesSlice = createSlice({
  name: 'abnormalTypes',
  initialState: {
    opticNerveAbnormalTypes: [],
    retinaAbnormalTypes: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpticNerveAbnormalTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOpticNerveAbnormalTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.opticNerveAbnormalTypes = action.payload;
      })
      .addCase(fetchRetinaAbnormalTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRetinaAbnormalTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.retinaAbnormalTypes = action.payload;
      })
      .addCase(fetchOpticNerveAbnormalTypes.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchRetinaAbnormalTypes.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default abnormalTypesSlice.reducer;
