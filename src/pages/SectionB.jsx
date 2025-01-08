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
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionBData } from "../features/sectionSlice.js";
import { fetchDiabetesMellitisTypes } from "../features/diabiticTpyeSlice.js";
import { submitFormData } from "../features/formSubmissionSlice"; // Import the submitFormData API
import { updateDrRegistryInfo } from "../features/updateFormSlice.js"; 

const SectionB = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch existing data from the Redux store
  const sectionAData = useSelector((state) => state.form.sectionA);
  const sectionBData = useSelector((state) => state.form.sectionB);
  // Extract patientId and DrRegistryId
  // const patientInfoId = sectionAData?.patientId;
  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));


  console.log("Patient ID:", patientInfoId);

  // Fetch diabetesMellitisTypes from Redux store
  const diabetesMellitisTypes = useSelector(
    (state) => state.dType.diabetesMellitisTypes
  );
  const diabetesStatus = useSelector((state) => state.dType.status);

  // Local state to manage form fields
  const [formData, setFormData] = useState({
    diabetesMellitisTypeId: null,
    diabetesDetectedDate: new Date().toISOString(),
    durationofDiabetes: null,
    treatmentStartDate: new Date().toISOString(), // Default date
    treatmentType: null,
    isAwarenessOnDiabetesRetinopathy: false,
    sourceofAwareness: null,
    isHypertension: false,
    hypertensionDuration: null,
    hypertensionMedicationName: null,
    isHyperlipidemia: false,
    hyperlipidemiaDuration: null,
    hyperlipidemiaMedicationName: null,
    isPregnancyHistory: false,
    pregnancyMonth: null,
    isCardiacProblem: false,
    cardiacProblem:null,
    isOtherMedicalHistory: false,
    otherMedicalHistory: null,
  });

  // Load Redux data into local state on mount
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, ...sectionBData }));
  }, [sectionBData]);

  useEffect(() => {
    // Fetch diabetes mellitus types if not already loaded
    if (diabetesStatus === "idle") {
      dispatch(fetchDiabetesMellitisTypes());
    }
  }, [diabetesStatus, dispatch]);

  // Update local state and Redux store when form fields change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    console.log(e.target);
    if (type === "radio") {
      if (name == "treatmentType") {
        setFormData((prevData) => {
          const updatedData = { ...prevData, [name]: parseInt(value) };
          dispatch(saveSectionBData(updatedData)); // Save data to Redux on every change
          return updatedData;
        });
      } else {
        const booleanValue = value === "yes"; // Convert radio value to boolean

        setFormData((prevData) => {
          const updatedData = { ...prevData, [name]: booleanValue };
          dispatch(saveSectionBData(updatedData)); // Save data to Redux on every change
          return updatedData;
        });
      }
    } else {
      if (
      
        name == "durationofDiabetes" ||
        name == "hyperlipidemiaDuration" ||
        name == "hypertensionDuration"||
        name == "pregnancyMonth"
      ) {
        setFormData((prevData) => {
          const updatedData = { ...prevData, [name]: parseInt(value) };
          dispatch(saveSectionBData(updatedData)); // Save data to Redux on every change
          return updatedData;
        });
      } else {
        setFormData((prevData) => {
          const updatedData = { ...prevData, [name]: value };
          dispatch(saveSectionBData(updatedData)); // Save data to Redux on every change
          return updatedData;
        });
      }
    }
  };

  const handleSubmit = () => {
    const payload = {
      patientInfoId,
      ...formData,
    };
  
    console.log("Submitting Payload:", payload);
  
    dispatch(submitFormData(payload))
      .unwrap()
      .then((response) => {
        console.log("API Response:", response);
  
        const id = response; 
        // Save DrRegistryId to Redux and localStorage
        dispatch(saveSectionBData({ ...formData, DrRegistryId: id, patientInfoId }));
        localStorage.setItem("DrRegistryId", id);
  
        alert("Registry ID created!");
           // Update the selected alphabet and navigate
       const nextAlphabet = 'Smoking-History';
       setSelectedAlphabet(nextAlphabet);
       localStorage.setItem('selectedAlphabet', nextAlphabet);
       navigate(`/section-${nextAlphabet}`);
        handleNextClick();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      });
  };
  
  const handleNextPage = () => {
    const id = localStorage.getItem("DrRegistryId");

    const payload = {
      patientInfoId,
      DrRegistryId: id,
      ...formData,
    };

    console.log("Updating Payload:", payload);

    dispatch(updateDrRegistryInfo(payload))
      .unwrap()
      .then(() => {
        console.log("API Response: Data updated successfully");
        alert("Data updated successfully!");
        handleNextClick(); // Proceed to next page after successful update
      })
      .catch((error) => {
        console.error("Error updating form:", error);
        alert("Failed to update the form. Please try again.");
      });
  };

  // Conditional rendering based on registration status
  const isRegistered = patientInfoId && localStorage.getItem("DrRegistryId");
  

    
  // const handleNextPage = () => {
  //   dispatch(saveSectionBData(formData)); // Ensure data is saved before navigation
  //   handleNextClick(); // Call the function provided by the Layout to navigate
  // };

  // const handlePreviousPage = () => {
  //   dispatch(saveSectionBData(formData)); // Ensure data is saved before navigation
  //   handlePreviousClick(); // Call the function provided by the Layout to navigate
  // };

  // const handleAlphabetClick = (alphabet) => {
  //   setSelectedAlphabet(alphabet); // Update selected alphabet
  //   localStorage.setItem("selectedAlphabet", alphabet); // Save to local storage
  //   navigate(`/section-${alphabet}`); // Navigate to the corresponding section
  // };

  const treatmentOptions = [
    { id: 1, label: "Oral Hypoglycemic Agent" },
    { id: 2, label: "Insulin" },
    { id: 3, label: "No Any" },
    { id: 4, label: "Diet Only" },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" marginBottom={2}>
        Section B: Medical History
      </Typography>

      <Grid container spacing={3}>
        {/* Diabetes Mellitus Type */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type of Diabetes Mellitus</InputLabel>
            <Select
              value={formData.diabetesMellitisTypeId || ""}
              label="Type of Diabetes Mellitus"
              onChange={handleInputChange}
              name="diabetesMellitisTypeId"
              disabled={diabetesStatus === "loading"}
            >
              {diabetesStatus === "loading" ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : diabetesMellitisTypes && diabetesMellitisTypes.length > 0 ? (
                diabetesMellitisTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Types Available</MenuItem>
              )}
            </Select>
            <FormHelperText>
              {diabetesStatus === "failed" ? "Failed to load types" : ""}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Duration of Diabetes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration of Diabetes (Years)"
            type="number"
            variant="outlined"
            name="durationofDiabetes"
            value={formData.durationofDiabetes}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Treatment of Diabetes */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Type of Treatment</FormLabel>
            <RadioGroup
              name="treatmentType"
              value={formData.treatmentType}
              onChange={handleInputChange}
            >
              {treatmentOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id.toString()} // Ensure value is correctly passed as a string
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Treatment Start Date */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Treatment Start Date"
            type="datetime-local"
            variant="outlined"
            name="treatmentStartDate"
            value={formData.treatmentStartDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true, // Ensure the label doesn't overlap with the date input
            }}
          />
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Specify Source"
            variant="outlined"
            name="sourceofAwareness"
            value={formData.sourceofAwareness}
            onChange={handleInputChange}
          />
        </Grid>

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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration of Hypertension (Years)"
            type="number"
            variant="outlined"
            name="hypertensionDuration"
            value={formData.hypertensionDuration}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Name of Medication"
            variant="outlined"
            name="hypertensionMedicationName"
            value={formData.hypertensionMedicationName}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Hyperlipidemia */}
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration of Hyperlipidemia (Years)"
            type="number"
            variant="outlined"
            name="hyperlipidemiaDuration"
            value={formData.hyperlipidemiaDuration}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Name of Medication"
            variant="outlined"
            name="hyperlipidemiaMedicationName"
            value={formData.hyperlipidemiaMedicationName}
            onChange={handleInputChange}
          />
        </Grid>

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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Month of Pregnancy"
            variant="outlined"
            name="pregnancyMonth"
            value={formData.pregnancyMonth}
            onChange={handleInputChange}
          />
        </Grid>

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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Please Specify"
            variant="outlined"
            name="cardiacProblem"
            value={formData.cardiacProblem}
            onChange={handleInputChange}
          />
        </Grid>

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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="If Yes, Please Specify"
            variant="outlined"
            name="otherMedicalHistory"
            value={formData.otherMedicalHistory}
            onChange={handleInputChange}
          />
        </Grid>
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
