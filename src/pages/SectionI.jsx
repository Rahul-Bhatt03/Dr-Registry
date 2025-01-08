import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { saveSectionIData } from "../features/sectionSlice.js";
import {
  fetchOpticNerveAbnormalTypes,
  fetchRetinaAbnormalTypes,
} from "../features/ocularAbnormalTypes.js";
import { updateDrRegistryInfo } from "../features/updateFormSlice.js"; // Import the update action

const normalizeFormData = (data) => {
  const defaultData = {
    odOpticNerveCondition: null,
    osOpticNerveCondition: null,
    odOpticNerveAbnormalTypeId: null,
    osOpticNerveAbnormalTypeId: null,
    odRetinaCondition: null,
    osRetinaCondition: null,
    odRetinaAbnormalTypeId: null,
    osRetinaAbnormalTypeId: null,
    otherFundusExamination: null,
  };

  return { ...defaultData, ...data };
};

const SectionI = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve section I data and abnormal types from Redux store
  const sectionIData = useSelector((state) => state.form.sectionI);
  const sectionHData = useSelector((state) => state.form.sectionH);
  const sectionGData = useSelector((state) => state.form.sectionG);
  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const id = parseInt(
    sectionBData.DrRegistryId || localStorage.getItem("DrRegistryId")
  );

  const { opticNerveAbnormalTypes, retinaAbnormalTypes, status } = useSelector(
    (state) => state.abnormalTypes
  );

  // Initialize state with normalized Redux data or default empty structure
  const [formData, setFormData] = useState(() =>
    normalizeFormData(sectionIData || {})
  );

  useEffect(() => {
    if (sectionIData) {
      setFormData(normalizeFormData(sectionIData));
    }
  }, [sectionIData]);

  useEffect(() => {
    dispatch(fetchOpticNerveAbnormalTypes());
    dispatch(fetchRetinaAbnormalTypes());
  }, [dispatch]);

  const handleStatusChange = (eye, value, section) => {
    const condition = value === "normal" ? 1 : 2;
    const abnormalTypeId = null; // Default value for abnormal type

    setFormData((prev) =>
      normalizeFormData({
        ...prev,
        [`${eye}${section}Condition`]: condition,
        [`${eye}${section}AbnormalTypeId`]: abnormalTypeId,
        [`${eye}OtherFundusExamination`]: null, // Reset "Other" field if condition changes
      })
    );

    if (condition === 2) {
      section === "OpticNerve"
        ? dispatch(fetchOpticNerveAbnormalTypes())
        : dispatch(fetchRetinaAbnormalTypes());
    }
  };

  const handleAbnormalTypeChange = (eye, value, section) => {
    setFormData((prev) =>
      normalizeFormData({
        ...prev,
        [`${eye}${section}AbnormalTypeId`]: value,
      })
    );
  };

  const handleOtherChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      otherFundusExamination: e.target.value,
    }));
  };

  const handleNextPage = async () => {
    try {
      const normalizedData = normalizeFormData(formData);
      dispatch(saveSectionIData(normalizedData));
  
      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...sectionDData,
        ...sectionEData,
        ...sectionFData,
        ...sectionGData,
        ...sectionHData,
        ...formData,
        patientInfoId,
        id,
      };
      console.log("Section I Payload:", payload);
  
      await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();
  
      const nextAlphabet = "DIABETIC-RETINOPATHY";
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem("selectedAlphabet", nextAlphabet);
      navigate(`/section-${nextAlphabet}`);
    } catch (error) {
      console.error("Error updating registry info:", error);
      alert("Failed to update registry info. Please try again.");
    }
  };
  

  const handlePreviousPage = () => {
    const normalizedData = normalizeFormData(formData);
    dispatch(saveSectionIData(normalizedData)); // Ensure normalized data is saved
    handlePreviousClick();
  };

  const renderEyeSection = (title, section) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" marginBottom={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {["od", "os"].map((eye) => (
          <Grid item xs={12} sm={6} key={eye}>
            <Typography variant="body2" marginBottom={1}>
              {eye === "OD" ? "Right Eye (OD)" : "Left Eye (OS)"}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={
                  formData[`${eye}${section}Condition`] === 1
                    ? "normal"
                    : formData[`${eye}${section}Condition`] === 2
                    ? "abnormal"
                    : null
                }
                onChange={(e) =>
                  handleStatusChange(eye, e.target.value, section)
                }
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                />
                <FormControlLabel
                  value="abnormal"
                  control={<Radio />}
                  label="Abnormal"
                />
              </RadioGroup>
            </FormControl>

            {formData[`${eye}${section}Condition`] === 2 && (
              <FormControl fullWidth>
                <InputLabel>Abnormal Type</InputLabel>
                <Select
                  value={formData[`${eye}${section}AbnormalTypeId`]}
                  onChange={(e) =>
                    handleAbnormalTypeChange(eye, e.target.value, section)
                  }
                  label="Abnormal Type"
                >
                  {section === "OpticNerve" &&
                    opticNerveAbnormalTypes.length > 0 &&
                    opticNerveAbnormalTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  {section === "Retina" &&
                    retinaAbnormalTypes.length > 0 &&
                    retinaAbnormalTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 1000,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" marginBottom={4}>
        Section I: Fundus Examination
      </Typography>

      <Grid container spacing={4}>
        {renderEyeSection("Optic Nerve", "OpticNerve")}
        {renderEyeSection("Retina", "Retina")}

        <Grid item xs={120}>
          <TextField
            label="other fundus examination"
            fullWidth
            value={formData.otherFundusExamination}
            onChange={handleOtherChange}
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>

        {/* Navigation Buttons */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginLeft: "20px" }}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionI;
