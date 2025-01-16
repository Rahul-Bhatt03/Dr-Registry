import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionEData } from "../features/sectionSlice.js";
import { updateDrRegistryInfo } from "../features/updateFormSlice.js";
import { addInvestigation } from "../features/investigationSlice.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SectionE = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus,
  formStatus,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve data from the Redux store
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const id = parseInt(
    sectionBData.DrRegistryId || localStorage.getItem("DrRegistryId")
  );

  // State to hold form data locally
  const [formData, setFormData] = useState(sectionEData || {});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Immediate BMI calculation
  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return parseFloat(bmi.toFixed(2));
    }
    return null;
  };

  // Immediate BP Status calculation
  const calculateBPStatus = (systolic, diastolic) => {
    if (systolic && diastolic) {
      if (systolic >= 160 || diastolic >= 100) return "4";
      if (systolic >= 140 || diastolic >= 90) return "3";
      if (systolic >= 120 || diastolic >= 80) return "2";
      return "1";
    }
    return null;
  };

  // Update formData when sectionEData from the store changes
  useEffect(() => {
    if (sectionEData) {
      setFormData(sectionEData);
    }
  }, [sectionEData]);

  // Handle next and previous page navigation
  const handleNextPage = async () => {
    setFormSubmitted(true);
    try {
      dispatch(saveSectionEData(formData));
      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...sectionDData,
        ...formData,
        patientInfoId, 
        id 
      };

      await dispatch(addInvestigation({ registryData: payload })).unwrap();
      
      // Update form status on success
      updateFormStatus('Investigation', true);
      
      toast.success("Investigation data added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      const nextAlphabet = 'Ocular-History';
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem('selectedAlphabet', nextAlphabet);
      navigate(`/section-${nextAlphabet}`);
      handleNextClick();
    } catch (error) {
      console.error("Error updating registry info:", error);
      toast.error("Failed to add investigation data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      // Update form status on failure
      updateFormStatus('Investigation', false);
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionEData(formData)); // Ensure data is saved before navigation
    handlePreviousClick(); // Call the function provided by the Layout to navigate
  };

  const isFieldString = (fieldName) => fieldName === "otherTest";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = isFieldString(name) ? value : value !== "" ? +value : null;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: numValue };

      // Immediate BMI calculation
      if (name === "height" || name === "weight") {
        const height = name === "height" ? numValue : prevData.height;
        const weight = name === "weight" ? numValue : prevData.weight;
        updatedData.bmi = calculateBMI(height, weight);
      }

      // Immediate BP Status calculation
      if (
        name === "bloadPressureSyestlolic" ||
        name === "bloadPressureDiastlolic"
      ) {
        const systolic =
          name === "bloadPressureSyestlolic"
            ? numValue
            : prevData.bloadPressureSyestlolic;
        const diastolic =
          name === "bloadPressureDiastlolic"
            ? numValue
            : prevData.bloadPressureDiastlolic;
        updatedData.bpStatus = calculateBPStatus(systolic, diastolic);
      }

      dispatch(saveSectionEData(updatedData));
      return updatedData;
    });
  };

  const commonTextFieldProps = {
    fullWidth: true,
    variant: "outlined",
    size: "medium",
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 1,
      },
    },
  };

  useEffect(() => {
    // Set the correct alphabet when the component mounts if not already set
    if (!selectedAlphabet) {
      setSelectedAlphabet("e");
      localStorage.setItem("selectedAlphabet", "e");
    }
  }, [selectedAlphabet, setSelectedAlphabet]);

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
        Section E: Investigation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            {...commonTextFieldProps}
            label="Date of Examination"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dateofExamination}
            onChange={(e) => handleChange("dateofExamination", e.target.value)}
          />
        </Grid>

        {/* Height and Weight */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Height (cm)"
            type="number"
            variant="outlined"
            name="height"
            value={formData.height || null}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Weight (Kg)"
            type="number"
            variant="outlined"
            name="weight"
            value={formData.weight || null}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="BMI"
            type="number"
            variant="outlined"
            name="bmi"
            value={formData.bmi || null}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {/* Blood Pressure Readings - Moved before BP Status */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Blood Pressure (Systolic)"
            type="number"
            variant="outlined"
            name="bloadPressureSyestlolic"
            value={formData.bloadPressureSyestlolic || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Blood Pressure (Diastolic)"
            type="number"
            variant="outlined"
            name="bloadPressureDiastlolic"
            value={formData.bloadPressureDiastlolic || ""}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Blood Pressure Status */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Blood Pressure Status</Typography>
            <RadioGroup
              row
              name="bpStatus"
              value={formData.bpStatus || ""}
              onChange={handleInputChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Normal (<120/80)"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Pre-Hypertension (120-139/80-89)"
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="Stage I (140-159/90-99)"
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label="Stage II (≥160/≥100)"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Blood Sugar */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Blood Sugar
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="fasting"
                type="number"
                variant="outlined"
                name="bloodSugarFasting"
                value={formData.bloodSugarFasting || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="random"
                type="number"
                variant="outlined"
                name="bloodSugarRandom"
                value={formData.bloodSugarRandom || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="PP"
                type="number"
                variant="outlined"
                name="bloodSugarPP"
                value={formData.bloodSugarPP || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="HbA1C"
                type="number"
                variant="outlined"
                name="bloodSugarHbA1C"
                value={formData.bloodSugarHbA1C || null}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Lipid Profile */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Lipid Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="totalCholesterol"
                type="number"
                variant="outlined"
                name="totalCholesterol"
                value={formData.totalCholesterol || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="LDL"
                type="number"
                variant="outlined"
                name="ldl"
                value={formData.ldl || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="HDL"
                type="number"
                variant="outlined"
                name="hdl"
                value={formData.hdl || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Triglyceride"
                type="number"
                variant="outlined"
                name="tryglyceride"
                value={formData.tryglyceride || null}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Renal Function Test */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Renal Function Test
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Urea"
                type="number"
                variant="outlined"
                name="urea"
                value={formData.urea || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Creatinine"
                type="number"
                variant="outlined"
                name="creatinine"
                value={formData.creatinine || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Na"
                type="number"
                variant="outlined"
                name="na"
                value={formData.na || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="K"
                type="number"
                variant="outlined"
                name="k"
                value={formData.k || null}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="BUN"
                type="number"
                variant="outlined"
                name="bun"
                value={formData.bun || null}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Specify Other Test"
            type="text"
            variant="outlined"
            name="otherTest"
            value={formData.otherTest || null}
            onChange={(e) => {
              const { value } = e.target;
              handleInputChange({
                target: { name: "otherTest", value: value.toString() },
              });
            }}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box marginTop={3} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextPage}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SectionE;
