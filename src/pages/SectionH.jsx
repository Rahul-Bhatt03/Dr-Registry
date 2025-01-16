import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  TextField,
  Button,
  FormHelperText,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveSectionHData } from "../features/sectionSlice";
import { addSlitlampExamination } from "../features/slitlampExaminationSlice.js";

const abnormalTypes = [
  { id: 1, label: "Type 1" },
  { id: 2, label: "Type 2" },
  { id: 3, label: "Other" },
];

const SectionH = ({
  handleNextClick,
  handlePreviousClick,
  setSelectedAlphabet,
  updateFormStatus,
  formStatus
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sectionHData = useSelector((state) => state.form.sectionH);
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const registryInfoId = parseInt(localStorage.getItem("DrRegistryId"));

  const initialAbnormalState = {
    selected: [],
    otherText: "",
  };

  const [formData, setFormData] = useState({
    registryInfoId: registryInfoId || 0,
    isODLidNormal: true,
    isODLidAbnormal: false,
    odLidAbnormal: "",
    isOSvLidNormal: true,
    isOSLidAbnormal: false,
    osLidAbnormal: "",
    isODConjunctivaNormal: true,
    isODConjunctivaAbnormal: false,
    odConjunctivaAbnormal: "",
    isOSvConjunctivaNormal: true,
    isOSConjunctivaAbnormal: false,
    osConjunctivaAbnormal: "",
    isODScleraNormal: true,
    isODScleraAbnormal: false,
    odScleraAbnormal: "",
    isOSvScleraNormal: true,
    isOSScleraAbnormal: false,
    osScleraAbnormal: "",
    isODCornealNormal: true,
    isODCornealAbnormal: false,
    odCornealAbnormal: "",
    isOSvCornealNormal: true,
    isOSCornealAbnormal: false,
    osCornealAbnormal: "",
    isODAnteriorChamberNormal: true,
    isODAnteriorChamberAbnormal: false,
    odAnteriorChamberAbnormal: "",
    isOSvAnteriorChamberNormal: true,
    isOSAnteriorChamberAbnormal: false,
    osAnteriorChamberAbnormal: "",
    isODIrisNormal: true,
    isODIrisAbnormal: false,
    odIrisAbnormal: "",
    isOSvIrisNormal: true,
    isOSIrisAbnormal: false,
    osIrisAbnormal: "",
    isODLensNormal: true,
    isODLensAbnormal: false,
    odLensAbnormal: "",
    isOSvLensNormal: true,
    isOSLensAbnormal: false,
    osLensAbnormal: "",
    isODCataract: false,
    odCataractType: "",
    isOSCataract: false,
    osCataractType: "",
    isODMatureCataract: false,
    isOSMatureCataract: false,
    isODComplicatedCataract: false,
    isOSComplicatedCataract: false,
    isODVitreousNormal: true,
    isODVitreousAbnormal: false,
    odVitreousAbnormal: "",
    isOSvVitreousNormal: true,
    isOSVitreousAbnormal: false,
    osVitreousAbnormal: "",
    otherSlitlampExamination: "",
    // Initialize abnormal arrays
    lidAbnormalOD: [],
    lidAbnormalOS: [],
    conjuncivaAbnormalOD: [],
    conjuncivaAbnormalOS: [],
    scleraAbnormalOD: [],
    scleraAbnormalOS: [],
    cornealAbnormalOD: [],
    cornealAbnormalOS: [],
    anteriorChamberAbnormalOD: [],
    anteriorChamberAbnormalOS: [],
    irisAbnormalOD: [],
    irisAbnormalOS: [],
    lensAbnormalOD: [],
    lensAbnormalOS: [],
    vitreousAbnormalOD: [],
    vitreousAbnormalOS: []
  });

  const [abnormalStates, setAbnormalStates] = useState({
    lidOD: initialAbnormalState,
    lidOS: initialAbnormalState,
    conjunctivaOD: initialAbnormalState,
    conjunctivaOS: initialAbnormalState,
    scleraOD: initialAbnormalState,
    scleraOS: initialAbnormalState,
    cornealOD: initialAbnormalState,
    cornealOS: initialAbnormalState,
    anteriorChamberOD: initialAbnormalState,
    anteriorChamberOS: initialAbnormalState,
    irisOD: initialAbnormalState,
    irisOS: initialAbnormalState,
    lensOD: initialAbnormalState,
    lensOS: initialAbnormalState,
    vitreousOD: initialAbnormalState,
    vitreousOS: initialAbnormalState,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sectionHData) {
      setFormData(prevData => ({
        ...prevData,
        ...sectionHData
      }));
    }
  }, [sectionHData]);

  const handleAbnormalCheckboxChange = (field, eyeSide, typeId) => {
    setAbnormalStates(prev => {
      const key = `${field}${eyeSide}`;
      const currentSelected = prev[key].selected;
      let newSelected;

      if (currentSelected.includes(typeId)) {
        newSelected = currentSelected.filter(id => id !== typeId);
      } else {
        newSelected = [...currentSelected, typeId];
      }

      // Update the corresponding array in formData
      const arrayKey = `${field}Abnormal${eyeSide}`;
      setFormData(prevFormData => ({
        ...prevFormData,
        [arrayKey]: newSelected.map(id => ({ abnormalTypeId: id }))
      }));

      return {
        ...prev,
        [key]: {
          ...prev[key],
          selected: newSelected
        }
      };
    });
  };

  const handleOtherTextChange = (field, eyeSide, text) => {
    const key = `${field}${eyeSide}`;
    setAbnormalStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        otherText: text
      }
    }));

    // Update the corresponding abnormal text field in formData
    const textKey = `${eyeSide.toLowerCase()}${field}Abnormal`;
    setFormData(prev => ({
      ...prev,
      [textKey]: text
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [field]: value,
      };

      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      dispatch(saveSectionHData(updatedData));
      return updatedData;
    });
  };

  const handleUpdateRegistry = async () => {
    try {
      // Update form data in Redux
      dispatch(saveSectionHData(formData));

      const payload = {
        ...formData,
        patientInfoId,
        registryInfoId
      };

      // Make the API call
      const response = await dispatch(addSlitlampExamination({ registryData: payload }));
      
      if (response.error) {
        throw new Error('API call failed');
      }

      // Update form status to complete
      updateFormStatus('Slit-Lamp-Examination', true);
      
      // Navigate to next section
      const nextAlphabet = "Fundus-Examination";
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem("selectedAlphabet", nextAlphabet);
      navigate(`/section-${nextAlphabet}`);

      handleNextClick();
    } catch (error) {
      console.error("Error updating SlitlampExamination:", error);
      updateFormStatus('Slit-Lamp-Examination', false);
    }
  };

  const renderAbnormalCheckboxes = (field, eyeSide) => {
    const stateKey = `${field}${eyeSide}`;
    return (
      <FormGroup>
        {abnormalTypes.map((type) => (
          <FormControlLabel
            key={type.id}
            control={
              <Checkbox
                checked={abnormalStates[stateKey].selected.includes(type.id)}
                onChange={() => handleAbnormalCheckboxChange(field, eyeSide, type.id)}
              />
            }
            label={type.label}
          />
        ))}
        {abnormalStates[stateKey].selected.includes(3) && (
          <TextField
            fullWidth
            label="Specify other"
            variant="outlined"
            value={abnormalStates[stateKey].otherText}
            onChange={(e) => handleOtherTextChange(field, eyeSide, e.target.value)}
            sx={{ mt: 1 }}
          />
        )}
      </FormGroup>
    );
  };

  const renderRadioGroup = (title, prefix, field) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" marginBottom={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {["OD", "OS"].map((eye) => (
          <Grid key={eye} item xs={12} sm={6}>
            <Typography variant="body2" marginBottom={1}>
              {eye}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup row>
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                  checked={formData[`${prefix}${eye}Normal`]}
                  onChange={() => {
                    handleInputChange(`${prefix}${eye}Normal`, true);
                    handleInputChange(`${prefix}${eye}Abnormal`, false);
                    // Reset abnormal state when switching to normal
                    setAbnormalStates(prev => ({
                      ...prev,
                      [`${field}${eye}`]: initialAbnormalState
                    }));
                  }}
                />
                <FormControlLabel
                  value="abnormal"
                  control={<Radio />}
                  label="Abnormal"
                  checked={formData[`${prefix}${eye}Abnormal`]}
                  onChange={() => {
                    handleInputChange(`${prefix}${eye}Normal`, false);
                    handleInputChange(`${prefix}${eye}Abnormal`, true);
                  }}
                />
              </RadioGroup>
              {formData[`${prefix}${eye}Abnormal`] && (
                renderAbnormalCheckboxes(field, eye)
              )}
            </FormControl>
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
        Section H: Slit Lamp Examination
      </Typography>
      <Grid container spacing={4}>
        {renderRadioGroup("Lid", "isODLid", "lid")}
        {renderRadioGroup("Conjunctiva", "isODConjunctiva", "conjunctiva")}
        {renderRadioGroup("Sclera", "isODSclera", "sclera")}
        {renderRadioGroup("Corneal", "isODCorneal", "corneal")}
        {renderRadioGroup("Anterior Chamber", "isODAnteriorChamber", "anteriorChamber")}
        {renderRadioGroup("Iris", "isODIris", "iris")}
        {renderRadioGroup("Lens", "isODLens", "lens")}
        
        {/* Cataract Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Cataract Assessment
          </Typography>
          <Grid container spacing={3}>
            {["OD", "OS"].map((eye) => (
              <Grid key={eye} item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <Typography variant="body2" marginBottom={1}>
                    {eye} Cataract
                  </Typography>
                  <RadioGroup row>
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      checked={formData[`is${eye}Cataract`]}
                      onChange={() => handleInputChange(`is${eye}Cataract`, true)}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      checked={formData[`is${eye}Cataract`] === false}
                      onChange={() => {
                        handleInputChange(`is${eye}Cataract`, false);
                        handleInputChange(`${eye.toLowerCase()}CataractType`, "");
                      }}
                    />
                  </RadioGroup>
                  {formData[`is${eye}Cataract`] && (
                    <TextField
                      fullWidth
                      label="Specify Cataract Type"
                      variant="outlined"
                      value={formData[`${eye.toLowerCase()}CataractType`] || ""}
                      onChange={(e) =>
                        handleInputChange(`${eye.toLowerCase()}CataractType`, e.target.value)
                      }
                      sx={{ mt: 1 }}
                    />
                  )}
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {renderRadioGroup("Vitreous", "isODVitreous", "vitreous")}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Other Slit Lamp Findings"
            variant="outlined"
            value={formData.otherSlitlampExamination || ""}
            onChange={(e) =>
              handleInputChange("otherSlitlampExamination", e.target.value)}
              />
            </Grid>
    
            {/* Mature Cataract Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" marginBottom={2}>
                Mature Cataract
              </Typography>
              <Grid container spacing={3}>
                {["OD", "OS"].map((eye) => (
                  <Grid key={eye} item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <Typography variant="body2" marginBottom={1}>
                        {eye} Mature Cataract
                      </Typography>
                      <RadioGroup row>
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                          checked={formData[`is${eye}MatureCataract`]}
                          onChange={() => handleInputChange(`is${eye}MatureCataract`, true)}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                          checked={formData[`is${eye}MatureCataract`] === false}
                          onChange={() => handleInputChange(`is${eye}MatureCataract`, false)}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>
    
            {/* Complicated Cataract Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" marginBottom={2}>
                Complicated Cataract
              </Typography>
              <Grid container spacing={3}>
                {["OD", "OS"].map((eye) => (
                  <Grid key={eye} item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <Typography variant="body2" marginBottom={1}>
                        {eye} Complicated Cataract
                      </Typography>
                      <RadioGroup row>
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                          checked={formData[`is${eye}ComplicatedCataract`]}
                          onChange={() => handleInputChange(`is${eye}ComplicatedCataract`, true)}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                          checked={formData[`is${eye}ComplicatedCataract`] === false}
                          onChange={() => handleInputChange(`is${eye}ComplicatedCataract`, false)}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>
    
            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handlePreviousClick}
                sx={{ mb: 2 }}
              >
                Previous Page
              </Button>
            </Grid>
    
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpdateRegistry}
              >
                Next Page
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    };
    
    export default SectionH;