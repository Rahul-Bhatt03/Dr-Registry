import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionBData } from "../features/sectionSlice.js";
import { submitFormData } from "../features/formSubmissionSlice";
import { updateDrRegistryInfo } from "../features/updateFormSlice.js";
import { addMedicalHistory } from '../features/medicalHistorySlice'; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const DURATION_TYPES = [
  { id: 1, label: "Days" },
  { id: 2, label: "Months" },
  { id: 3, label: "Years" },
];

const DIABETES_TYPES = [
  { id: 1, label: "Type I" },
  { id: 2, label: "Type II" },
  { id: 3, label: "Others" },
];

const MEDICINE_OPTIONS = [
  { id: 1, label: "Medicine 1" },
  { id: 2, label: "Medicine 2" },
  { id: 3, label: "Medicine 3" },
];

const TREATMENT_OPTIONS = [
  { id: 1, label: "Oral Hypoglycemic Agent" },
  { id: 2, label: "Insulin" },
  { id: 3, label: "No Any" },
  { id: 4, label: "Diet Only" },
];

const SectionB = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus,
  formStatus
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sectionBData = useSelector((state) => state.form.sectionB);
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const [formErrors,setFormErrors]=useState({})

  const [formData, setFormData] = useState({
    diabetesMellitisType: null,
    otherDiabetesMellitisType: null,
    diabetesDetectedDate: new Date().toISOString(),
    durationofDiabetes: null,
    diabetesDurationType: 1,
    treatmentType: null,
    selectedTreatments: [],
    isAwarenessOnDiabetesRetinopathy: false,
    sourceofAwareness: null,

    isHypertension: false,
    hypertensionDuration: null,
    hypertensionDurationType: 1,
    isHypertensionTreatment: false,
    hypertensionMedicineId: null,
    hypertensionMedicationName: null,

    isHyperlipidemia: false,
    hyperlipidemiaDuration: null,
    hyperlipidemiaDurationType: 1,
    isHyperlipidemiaTreatment: false,
    hyperlipidemiaMedicineId: null,
    hyperlipidemiaMedicationName: null,

    isPregnancyHistory: false,
    pregnancyMonth: null,
    isCardiacProblem: false,
    cardiacProblem: null,

    isOtherMedicalHistory: false,
    otherMedicalHistory: null,
    otherMedicalDuration: null,
    otherMedicalDurationType: 1,
    otherMedicationName: null,
  });

  const validateForm = () => {
    const errors = {};
    
    // Required field validation
    if (!formData.diabetesMellitisType) errors.diabetesMellitisType = "Required";
    if (!formData.durationofDiabetes) errors.durationofDiabetes = "Required";
    if (formData.diabetesMellitisType === 3 && !formData.otherDiabetesMellitisType) {
      errors.otherDiabetesMellitisType = "Required for Other type";
    }
    if (formData.selectedTreatments.length === 0){errors.treatments = "Select at least one treatment";}

    // Validate hypertension data if yes
    if (formData.isHypertension) {
      if (!formData.hypertensionDuration) errors.hypertensionDuration = "Required";
      if (formData.isHypertensionTreatment && !formData.hypertensionMedicineId) {
        errors.hypertensionMedicineId = "Required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

    // Effect to check form completion status
    useEffect(() => {
      const isFormComplete = validateForm();
      // Only update if the form status has changed
      if (formStatus['Medical-History'] !== isFormComplete) {
        updateFormStatus('Medical-History', isFormComplete);
      }
    }, [formData, updateFormStatus]);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, ...sectionBData }));
  }, [sectionBData]);

  const handleTreatmentChange = (treatmentId) => {
    setFormData((prevData) => {
      const existingTreatmentIndex = prevData.selectedTreatments.findIndex(
        (t) => t.treatmentType === treatmentId
      );

      let updatedTreatments;
      if (existingTreatmentIndex === -1) {
        updatedTreatments = [
          ...prevData.selectedTreatments,
          {
            medicalHistoryInfoId: 0,
            treatmentType: treatmentId,
            treatmentStartDate: new Date().toISOString(),
            treatmentofDiabetes: 0,
            treatmentDurationType: 1
          }
        ];
      } else {
        updatedTreatments = prevData.selectedTreatments.filter(
          (_, index) => index !== existingTreatmentIndex
        );
      }

      return {
        ...prevData,
        selectedTreatments: updatedTreatments
      };
    });
  };

  const handleTreatmentDateChange = (treatmentId, date) => {
    setFormData((prevData) => {
      const updatedTreatments = prevData.selectedTreatments.map(treatment => {
        if (treatment.treatmentType === treatmentId) {
          return { ...treatment, treatmentStartDate: date };
        }
        return treatment;
      });

      return {
        ...prevData,
        selectedTreatments: updatedTreatments
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
        const booleanValue = value === "yes";
        setFormData(prevData => ({
            ...prevData,
            [name]: booleanValue,
            ...(name === "isHypertension" && !booleanValue ? {
                hypertensionDuration: null,
                hypertensionDurationType: 1,
                isHypertensionTreatment: false,
                hypertensionMedicineId: null,
                hypertensionMedicationName: null
            } : {}),
            ...(name === "isHyperlipidemia" && !booleanValue ? {
                hyperlipidemiaDuration: null,
                hyperlipidemiaDurationType: 1,
                isHyperlipidemiaTreatment: false,
                hyperlipidemiaMedicineId: null,
                hyperlipidemiaMedicationName: null
            } : {})
        }));
    } else if (type === "number") {
        // Convert number input to numeric value
        setFormData(prevData => ({
            ...prevData,
            [name]: parseInt(value) || null,  // Use parseFloat(value) if you expect decimal numbers
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
            ...(name === "diabetesMellitisType" && parseInt(value) !== 3 ? { otherDiabetesMellitisType: null } : {})
        }));
    }
};


  const prepareMedicineListDTO = () => {
    const medicineList = [];
    
    if (formData.isHypertension && formData.isHypertensionTreatment && formData.hypertensionMedicineId) {
      medicineList.push({
        medicalHistoryInfoId: null,
        healthIssueType: 1,
        medicine: parseInt(formData.hypertensionMedicineId)
      });
    }

    if (formData.isHyperlipidemia && formData.isHyperlipidemiaTreatment && formData.hyperlipidemiaMedicineId) {
      medicineList.push({
        medicalHistoryInfoId: null,
        healthIssueType: 2,
        medicine: parseInt(formData.hyperlipidemiaMedicineId)
      });
    }

    return medicineList;
  };

   const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        toast.error("Please fill in all required fields correctly", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const payload = {
        patientInfoId,
        ...formData,
        medicalHistoryTreatmentTypeInfoDTOs: formData.selectedTreatments,
        medicineListInfoDTOs: prepareMedicineListDTO()
      };

      const result = await dispatch(addMedicalHistory(payload)).unwrap();
      
      if (result) {
        dispatch(saveSectionBData({ ...formData, DrRegistryId: result, patientInfoId }));
        localStorage.setItem("DrRegistryId", result);
        
        // Update form status on successful submission
        updateFormStatus('Medical-History', true);
        
        toast.success("Medical history added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        const nextAlphabet = "Smoking-History";
        setSelectedAlphabet(nextAlphabet);
        localStorage.setItem("selectedAlphabet", nextAlphabet);
        navigate(`/section-${nextAlphabet}`);
        handleNextClick();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to add medical history. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      // Update form status on failure
      updateFormStatus('Medical-History', false);
    }
  };

  const handleNextPage = async () => {
    try {
      if (!validateForm()) {
        toast.error("Please fill in all required fields correctly", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const id = localStorage.getItem("DrRegistryId");
      const payload = {
        patientInfoId,
        DrRegistryId: id,
        ...formData,
      };

      await dispatch(updateDrRegistryInfo(payload)).unwrap();
      
      // Update form status on successful update
      updateFormStatus('Medical-History', true);
      
      toast.success("Data updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      handleNextClick();
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update the form. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      // Update form status on failure
      updateFormStatus('Medical-History', false);
    }
  };

  const isRegistered = patientInfoId && localStorage.getItem("DrRegistryId");

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto", boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
      <Typography variant="h6" marginBottom={2}>
        Section B: Medical History
      </Typography>

         {/* Add error messages for form-level errors */}
         {Object.keys(formErrors).length > 0 && (
        <Box sx={{ mb: 2, color: 'error.main' }}>
          Please fill-up the highlighted fields
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Diabetes Mellitus Type */}
        <Grid item xs={12}>
          <FormControl fullWidth  error={!!formErrors.diabetesMellitisType}>
            <InputLabel>Type of Diabetes Mellitus</InputLabel>
            <Select
              value={formData.diabetesMellitisType || null}
              label="Type of Diabetes Mellitus"
              onChange={handleInputChange}
              name="diabetesMellitisType"
            >
              {DIABETES_TYPES.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {formData.diabetesMellitisType === 3 && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Other Type"
              variant="outlined"
              name="otherDiabetesMellitisType"
              value={formData.otherDiabetesMellitisType||null}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Diabetes Detected Date"
            type="datetime-local"
            variant="outlined"
            name="diabetesDetectedDate"
            value={formData.diabetesDetectedDate||null}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Duration of Diabetes"
            type="number"
            variant="outlined"
            name="durationofDiabetes"
            value={parseInt(formData.durationofDiabetes) || null}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Duration Type</InputLabel>
            <Select
              value={formData.diabetesDurationType}
              label="Duration Type"
              name="diabetesDurationType"
              onChange={handleInputChange}
            >
              {DURATION_TYPES.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Treatment of Diabetes */}
        <Grid item xs={12} >
          <FormControl component="fieldset"  error={!!formErrors.selectedTreatments} >
            <FormLabel>Type of Treatment</FormLabel>
            <Grid container spacing={2}>
              {TREATMENT_OPTIONS.map((option) => (
                <Grid item xs={12} key={option.id}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={formData.selectedTreatments.some(
                            t => t.treatmentType === option.id
                          )}
                          onChange={() => handleTreatmentChange(option.id)}
                        />
                      }
                      label={option.label}
                    />
                    {formData.selectedTreatments.some(t => t.treatmentType === option.id) && 
                     option.id !== 3 && option.id !== 4 && (
                      <TextField
                        type="datetime-local"
                        size="small"
                        value={
                          formData.selectedTreatments.find(
                            t => t.treatmentType === option.id
                          )?.treatmentStartDate || null
                        }
                        onChange={(e) => handleTreatmentDateChange(option.id, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </Grid>

        {/* Awareness on Diabetic Retinopathy */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Awareness on Diabetic Retinopathy</FormLabel>
            <RadioGroup
              row
              name="isAwarenessOnDiabetesRetinopathy"
              value={formData.isAwarenessOnDiabetesRetinopathy ? "yes" : "no"}
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {formData.isAwarenessOnDiabetesRetinopathy && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Source of Awareness"
              variant="outlined"
              name="sourceofAwareness"
              value={formData.sourceofAwareness||null}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {/* Hypertension */}
        <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel>Hypertension</FormLabel>
          <RadioGroup
            row
            name="isHypertension"
            value={formData.isHypertension ? "yes" : "no"}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {formData.isHypertension && (
        <>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Duration"
              type="number"
              variant="outlined"
              name="hypertensionDuration"
              value={parseInt(formData.hypertensionDuration) || null}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Duration Type</InputLabel>
              <Select
                value={formData.hypertensionDurationType||null}
                label="Duration Type"
                name="hypertensionDurationType"
                onChange={handleInputChange}
              >
                {DURATION_TYPES.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>Under Treatment?</FormLabel>
              <RadioGroup
                row
                name="isHypertensionTreatment"
                value={formData.isHypertensionTreatment ? "yes" : "no"}
                onChange={handleInputChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formData.isHypertensionTreatment && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Medicine</InputLabel>
                <Select
                  value={formData.hypertensionMedicineId || null}
                  name="hypertensionMedicineId"
                  onChange={handleInputChange}
                  label="Select Medicine"
                >
                  {MEDICINE_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </>
      )}

      {/* Updated Hyperlipidemia Section */}
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel>Hyperlipidemia</FormLabel>
          <RadioGroup
            row
            name="isHyperlipidemia"
            value={formData.isHyperlipidemia ? "yes" : "no"}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {formData.isHyperlipidemia && (
        <>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Duration"
              type="number"
              variant="outlined"
              name="hyperlipidemiaDuration"
              value={parseInt(formData.hyperlipidemiaDuration) || null}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Duration Type</InputLabel>
              <Select
                value={formData.hyperlipidemiaDurationType}
                label="Duration Type"
                name="hyperlipidemiaDurationType"
                onChange={handleInputChange}
              >
                {DURATION_TYPES.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>Under Treatment?</FormLabel>
              <RadioGroup
                row
                name="isHyperlipidemiaTreatment"
                value={formData.isHyperlipidemiaTreatment ? "yes" : "no"}
                onChange={handleInputChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formData.isHyperlipidemiaTreatment && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Medicine</InputLabel>
                <Select
                  value={formData.hyperlipidemiaMedicineId || ""}
                  name="hyperlipidemiaMedicineId"
                  onChange={handleInputChange}
                  label="Select Medicine"
                >
                  {MEDICINE_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </>
      )}
        {/* Pregnancy History */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Pregnancy History</FormLabel>
            <RadioGroup
              row
              name="isPregnancyHistory"
              value={formData.isPregnancyHistory ? "yes" : "no"}
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {formData.isPregnancyHistory && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pregnancy Month"
              type="number"
              variant="outlined"
              name="pregnancyMonth"
              value={formData.pregnancyMonth || null}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {/* Cardiac Problem */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Cardiac Problem</FormLabel>
            <RadioGroup
              row
              name="isCardiacProblem"
              value={formData.isCardiacProblem ? "yes" : "no"}
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {formData.isCardiacProblem && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Cardiac Problem"
              variant="outlined"
              name="cardiacProblem"
              value={formData.cardiacProblem || null}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {/* Other Medical History */}
        <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel>Other Medical History</FormLabel>
          <RadioGroup
            row
            name="isOtherMedicalHistory"
            value={formData.isOtherMedicalHistory ? "yes" : "no"}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
      
      {formData.isOtherMedicalHistory && (
        <>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Medical Condition"
              variant="outlined"
              name="otherMedicalHistory"
              value={formData.otherMedicalHistory||null}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Duration"
              type="number"
              variant="outlined"
              name="otherMedicalDuration"
              value={formData.otherMedicalDuration||null}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Duration Type</InputLabel>
              <Select
                value={formData.otherMedicalDurationType||null}
                label="Duration Type"
                name="otherMedicalDurationType"
                onChange={handleInputChange}
              >
                {DURATION_TYPES.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Medication Name"
              variant="outlined"
              name="otherMedicationName"
              value={formData.otherMedicationName||null}
              onChange={handleInputChange}
            />
          </Grid>
        </>
      )}
</Grid>

      {/* Navigation Buttons */}
      <Box mt={4}>
        {/* Submit Button or Next Button */}
        <Grid item xs={12}>
          {isRegistered ? (
            <Button variant="contained" onClick={handleNextPage}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default SectionB;
