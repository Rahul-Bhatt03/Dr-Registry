import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sectionA: {},
  sectionB: {},
  sectionC: {},
  sectionD: {},
  sectionE: {},
  sectionF: {},
  sectionG: {},
  sectionH: {},
  sectionI: {},
  sectionJ: {},


};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    saveSectionAData: (state, action) => {
      state.sectionA = action.payload;
    },
    saveSectionBData: (state, action) => {
      state.sectionB = action.payload;
    },
    saveSectionCData: (state, action) => {
      state.sectionC = action.payload;
    },
    saveSectionDData: (state, action) => {
      state.sectionD = action.payload;
    },
    saveSectionEData: (state, action) => {
      state.sectionE = action.payload;
    },
    saveSectionFData: (state, action) => {
      state.sectionF = action.payload;
    },
    saveSectionGData: (state, action) => {
      state.sectionG = action.payload;
    },
    saveSectionHData: (state, action) => {
      state.sectionH = action.payload;
    },
    saveSectionIData: (state, action) => {
      state.sectionI = action.payload;
    },
    saveSectionJData: (state, action) => {
      state.sectionJ = action.payload;
    },
  },
});



export const { saveSectionAData, saveSectionBData, saveSectionCData ,saveSectionDData,saveSectionEData,saveSectionFData,saveSectionGData,saveSectionHData,saveSectionIData,saveSectionJData} = formSlice.actions;

export default formSlice.reducer;
