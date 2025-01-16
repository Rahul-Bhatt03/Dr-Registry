import { configureStore } from '@reduxjs/toolkit';
import formReducer from '../features/sectionSlice.js';
import authReducer from '../features/authSlice.js';
import ethnicGroupsReducer from '../features/ethnicGroupSlice.js'
import adminReducer from '../features/adminSlice.js'
import formSubmissionReducer from "../features/formSubmissionSlice.js";
import locationReducer from '../features/locationSlice.js'
import occupationsReducer from '../features/occupationsSlice.js'
import genericReducer from '../features/genericSlice.js'
import dTypeReducer from '../features/diabiticTpyeSlice.js'
import systemicComplicationsReducer from '../features/systemicComplicationsSlice.js';
import ohtReducer from '../features/ocularHistoryTitles.js'
import abnormalTypesReducer from '../features/ocularAbnormalTypes.js'
import intravitrealInjectionReducer from '../features/intravitrealInjectionSlice.js'
import diabeticRetinopathyReducer from '../features/diabeticRetinopathyTimesSlice.js'
import patientsReducer from '../features/patientsSlice.js'
import surgeryReducer from '../features/surgerySlice.js'
import hospitalsReducer from '../features/hospitalSlice.js'
import patientsByHospitalReducer from '../features/patientByHospitalSlice.js'
import registerReducer from '../features/registerSlice.js'
import patientInfoReducer from '../features/patientInfoSlice.js'
import drRegistryReducer from '../features/updateFormSlice.js'
import patientDetailReducer from '../features/patientDetailSlice.js'
import dataReducer from '../features/dataByDrregistryId.js'
import medicalHistoryReducer from '../features/medicalHistorySlice.js'
import smokingHistoryReducer from '../features/smokingHistorySlice.js'
import investigationReducer from '../features/investigationSlice.js'
import ocularHistoryReducer from '../features/ocularHistorySlice.js'
import externalExaminationReducer from '../features/externalExaminationSlice.js'
import slitlampExaminationReducer from '../features/slitlampExaminationSlice.js'
import fundusExaminationReducer from '../features/fundusExaminationSlice.js'
import registryReducer from '../features/addRegistry.js'
import historyReducer from '../features/historySlice.js'
import dataSourceReducer from '../features/dataSourceSlice.js'

const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
    ethnicGroups: ethnicGroupsReducer, 
    admins: adminReducer,
    formSubmission: formSubmissionReducer,
    location: locationReducer,
    occupations:occupationsReducer,
    generic:genericReducer,
    dType:dTypeReducer,
    register:registerReducer,
    systemicComplications: systemicComplicationsReducer,
    oht:ohtReducer,
    abnormalTypes:abnormalTypesReducer,
    intravitrealInjection:intravitrealInjectionReducer,
    diabeticRetinopathy:diabeticRetinopathyReducer,
    patients:patientsReducer,
    surgery:surgeryReducer,
    hospitals:hospitalsReducer,
    patientsByHospital:patientsByHospitalReducer,
    patientInfo:patientInfoReducer,
    drRegistry:drRegistryReducer,
    patientDetail: patientDetailReducer,
    data:dataReducer,
    medicalHistory: medicalHistoryReducer,
    smokingHistory: smokingHistoryReducer,
    registry:registryReducer,
    investigations:investigationReducer,
    ocularHistory:ocularHistoryReducer,
    externalExamination:externalExaminationReducer,
    slitlampExamination:slitlampExaminationReducer,
    fundusExamination:fundusExaminationReducer,
    registry:registryReducer,
    history:historyReducer,
    dataSource:dataSourceReducer
    },
});

export default store;
