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
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { saveSectionIData } from "../features/sectionSlice.js";
import {
  fetchOpticNerveAbnormalTypes,
  fetchRetinaAbnormalTypes,
} from "../features/ocularAbnormalTypes.js";
import { updateDrRegistryInfo } from "../features/updateFormSlice.js";
import { addFundusExamination } from "../features/fundusExaminationSlice.js";

const normalizeFormData = (data) => {
  const defaultData = {
    registryInfoId: 0,
    odOpticNerveCondition: null,
    osOpticNerveCondition: null,
    otherODOpticNerveAbnormalType: "",
    otherOSOpticNerveAbnormalType: "",
    odRetinaCondition: null,
    osRetinaCondition: null,
    otherODRetinaAbnormalType: "",
    otherOSRetinaAbnormalType: "",
    otherFundusExamination: "",
    opticNerveAbnormalOD: [],
    opticNerveAbnormalOS: [],
    retinaAbnormalOD: [],
    retinaAbnormalOS: []
  };

  return { ...defaultData, ...data };
};

const SectionI = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus,
  formStatus
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sectionIData = useSelector((state) => state.form.sectionI);
  const registryInfoId = parseInt(localStorage.getItem("DrRegistryId")) || 0;

  const { opticNerveAbnormalTypes, retinaAbnormalTypes } = useSelector(
    (state) => state.abnormalTypes
  );

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

  const isFormComplete = (data) => {
    const opticNerveComplete = 
      data.odOpticNerveCondition && data.osOpticNerveCondition &&
      (data.odOpticNerveCondition === 1 || data.opticNerveAbnormalOD.length > 0) &&
      (data.osOpticNerveCondition === 1 || data.opticNerveAbnormalOS.length > 0);

    const retinaComplete = 
      data.odRetinaCondition && data.osRetinaCondition &&
      (data.odRetinaCondition === 1 || data.retinaAbnormalOD.length > 0) &&
      (data.osRetinaCondition === 1 || data.retinaAbnormalOS.length > 0);

    return opticNerveComplete && retinaComplete;
  };

  const handleStatusChange = (eye, value, section) => {
    const condition = value === "normal" ? 1 : 2;
    const updatedData = {
      ...formData,
      [`${eye}${section}Condition`]: condition,
    };

    // Reset abnormal types when changing to normal
    if (condition === 1) {
      if (section === "OpticNerve") {
        updatedData[`opticNerveAbnormal${eye.toUpperCase()}`] = [];
        updatedData[`otherOD${section}AbnormalType`] = "";
      } else {
        updatedData[`retinaAbnormal${eye.toUpperCase()}`] = [];
        updatedData[`otherOD${section}AbnormalType`] = "";
      }
    }

    setFormData(updatedData);
    dispatch(saveSectionIData(updatedData));
  };

  const handleAbnormalTypeChange = (eye, abnormalTypeId, section, isChecked) => {
    const updatedData = { ...formData };
    const arrayKey = section === "OpticNerve" 
      ? `opticNerveAbnormal${eye.toUpperCase()}` 
      : `retinaAbnormal${eye.toUpperCase()}`;
    
    if (isChecked) {
      // Add the abnormal type if it's checked
      updatedData[arrayKey] = [
        ...updatedData[arrayKey],
        { abnormalTypeId }
      ];
    } else {
      // Remove the abnormal type if it's unchecked
      updatedData[arrayKey] = updatedData[arrayKey].filter(
        item => item.abnormalTypeId !== abnormalTypeId
      );
    }

    setFormData(updatedData);
    dispatch(saveSectionIData(updatedData));
  };

  const handleOtherChange = (e) => {
    const updatedData = {
      ...formData,
      otherFundusExamination: e.target.value
    };
    setFormData(updatedData);
    dispatch(saveSectionIData(updatedData));
  };

  const isAbnormalTypeSelected = (eye, abnormalTypeId, section) => {
    const arrayKey = section === "OpticNerve" 
      ? `opticNerveAbnormal${eye.toUpperCase()}` 
      : `retinaAbnormal${eye.toUpperCase()}`;
    
    return formData[arrayKey].some(item => item.abnormalTypeId === abnormalTypeId);
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
              {eye === "od" ? "Right Eye (OD)" : "Left Eye (OS)"}
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
              <FormControl component="fieldset" sx={{ ml: 2 }}>
                <Typography variant="body2" marginBottom={1}>
                  Select Abnormal Types:
                </Typography>
                {section === "OpticNerve" &&
                  opticNerveAbnormalTypes.map((type) => (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox
                          checked={isAbnormalTypeSelected(eye, type.id, section)}
                          onChange={(e) =>
                            handleAbnormalTypeChange(
                              eye,
                              type.id,
                              section,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={type.name}
                    />
                  ))}
                {section === "Retina" &&
                  retinaAbnormalTypes.map((type) => (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox
                          checked={isAbnormalTypeSelected(eye, type.id, section)}
                          onChange={(e) =>
                            handleAbnormalTypeChange(
                              eye,
                              type.id,
                              section,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={type.name}
                    />
                  ))}
              </FormControl>
            )}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  const handleNextPage = async () => {
    try {
      const normalizedData = {
        ...normalizeFormData(formData),
        registryInfoId
      };

      const isComplete = isFormComplete(normalizedData);
      if (updateFormStatus) {
        updateFormStatus('Fundus-Examination', isComplete);
      }

      await dispatch(addFundusExamination(normalizedData)).unwrap();
      dispatch(saveSectionIData(normalizedData));

      const nextAlphabet = "DIABETIC-RETINOPATHY";
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem("selectedAlphabet", nextAlphabet);
      navigate(`/section-${nextAlphabet}`);
      
      handleNextClick();
    } catch (error) {
      console.error("Error updating fundus examination:", error);
      alert("Failed to update fundus examination. Please try again.");
    }
  };

  const handlePreviousPage = () => {
    const normalizedData = normalizeFormData(formData);
    dispatch(saveSectionIData(normalizedData));
    handlePreviousClick();
  };

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

        <Grid item xs={12}>
          <TextField
            label="Other fundus examination"
            fullWidth
            value={formData.otherFundusExamination}
            onChange={handleOtherChange}
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>

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
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionI;