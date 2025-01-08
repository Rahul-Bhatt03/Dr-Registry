import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";

export const fetchOcularHistoryTitles = createAsyncThunk(
  "form/fetchOcularHistoryTitles",
  async () => {
    const response = await axios.get(`${BASE_URL}/Generic/GetAllOcularHistoryTitles`);
    console.log(response)
    return response.data;
  }
);

const ohtSlice = createSlice({
    name: "oht",
    initialState: {
      sectionF: {},
      ocularHistoryTitles: [],
      loading: false,
    },
    reducers: {
      saveSectionFData(state, action) {
        state.sectionF = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOcularHistoryTitles.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchOcularHistoryTitles.fulfilled, (state, action) => {
          state.ocularHistoryTitles = action.payload;
          console.log(action)
          state.loading = false;
        })
        .addCase(fetchOcularHistoryTitles.rejected, (state) => {
          state.loading = false;
        });
    },
  });
  
export const { saveSectionFData } = ohtSlice.actions;
export default ohtSlice.reducer;
