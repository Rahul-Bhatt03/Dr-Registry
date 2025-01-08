// features/formSubmissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./endPoints";
import { formSections } from "../pages/formFields/formField";

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Use the new origin
});

// Thunk for submitting the form
export const submitFormData = createAsyncThunk(
  "formSubmission/submitFormData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState(); // Access the Redux state
      const allSectionsData = state.form; // Collect all section data
      const { ocularHistoryTitles } = state.oht;
      const {
        sectionB,
        sectionC,
        sectionD,
        sectionE,
        sectionF,
        sectionG,
        sectionH,
        sectionI,
        sectionJ,
      } = allSectionsData;
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        return rejectWithValue("Token is missing. Please log in again.");
      }

      let data = ocularHistoryTitles?.map((t) => {
        if (sectionF?.[t?.id] != undefined) {
          return { ...sectionF?.[t?.id] };
        }
      });
      data = data?.filter((t) => t != undefined);

      let newSectionJ = {};
      for (const [key, value] of Object.entries(sectionJ)) {
        console.log(`${key}: ${value}`);
        formSections.map((a) => {
          if (typeof value!='object'&&value!=null) {
            newSectionJ[key] = value;
          }
        });
      }
      console.log("newSectionJ", newSectionJ);

      const response = await axios.post(
        `${BASE_URL}/DrRegistry/addDrRegistryInfo`,
        {
        
          ...sectionB,
          ...sectionC,
          ...sectionD,
          ...sectionE,
          ...sectionF,
          ...sectionG,
          ...sectionH,
          ...sectionI,
          ...sectionJ,
          ...newSectionJ,

          ocularHistoryAndExaminationDTOs: data,
        },
        // ...sectionA,...sectionB,...sectionC,...sectionD,...sectionE,...sectionF,...sectionG,...sectionH,...sectionI,...sectionJ,ocularHistoryAndExaminationDTOs:data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const formSubmissionSlice = createSlice({
  name: "formSubmission",
  initialState: {
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetFormSubmissionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(submitFormData.fulfilled, (state) => {
        state.loading = false;
        state.success = "Form submitted successfully!";
        state.form = {}; // Reset form data
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit form data.";
      });
  },
});

export const { resetFormSubmissionState } = formSubmissionSlice.actions;

export default formSubmissionSlice.reducer;
