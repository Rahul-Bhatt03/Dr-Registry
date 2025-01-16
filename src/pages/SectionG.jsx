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
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionGData } from "../features/sectionSlice.js";
import { updateDrRegistryInfo } from '../features/updateFormSlice.js';
import { addExternalExamination } from "../features/externalExaminationSlice.js";

const SectionG = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus,
  formStatus
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sectionGData = useSelector((state) => state.form.sectionG);
  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
  const registryInfoId = parseInt(localStorage.getItem('DrRegistryId'));

  const ocularMovementOptions = [
    { id: 1, name: "Restricted Movement" },
    { id: 2, name: "Complete Paralysis" },
    { id: 3, name: "Partial Paralysis" },
    { id: 4, name: "Nystagmus" },
    { id: 5, name: "Other" }
  ];

  const pupilReactionOptions = [
    { id: 1, name: "Sluggish" },
    { id: 2, name: "Non-reactive" },
    { id: 3, name: "RAPD" },
    { id: 4, name: "Irregular Shape" },
    { id: 5, name: "Other" }
  ];

  const initialFormData = {
    registryInfoId: registryInfoId || 0,
    isProptosisOD: false,
    isProptosisOS: false,
    isODocularmovementNormal: true,
    isODocularmovementAbnormal: false,
    oDocularmovementAbnormal: "",
    isOSocularmovementNormal: true,
    isOSocularmovementAbnormal: false,
    oSocularmovementAbnormal: "",
    isODPupilReactionNormal: true,
    isODPupilReactionAbnormal: false,
    odPupilReactionAbnormal: "",
    isOSPupilReactionNormal: true,
    isOSPupilReactionAbnormal: false,
    osPupilReactionAbnormal: "",
    extraOcularMovementAbnormalDTOOD: [],
    extraOcularMovementAbnormalDTOOS: [],
    pupilLightReactionAbnormalDTOOD: [],
    pupilLightReactionAbnormalDTOOS: [],
    odOcularMovementType: "",
    osOcularMovementType: "",
    odPupilReactionType: "",
    osPupilReactionType: ""
  };

  const isFormComplete = (data) => {
    // Check if all required fields are filled
    const odComplete = data.isODocularmovementNormal || 
      (data.isODocularmovementAbnormal && data.oDocularmovementAbnormal) ||
      (data.isODocularmovementAbnormal && data.odOcularMovementType && data.odOcularMovementType !== "Other");
    
    const osComplete = data.isOSocularmovementNormal ||
      (data.isOSocularmovementAbnormal && data.oSocularmovementAbnormal) ||
      (data.isOSocularmovementAbnormal && data.osOcularMovementType && data.osOcularMovementType !== "Other");
    
    const odPupilComplete = data.isODPupilReactionNormal ||
      (data.isODPupilReactionAbnormal && data.odPupilReactionAbnormal) ||
      (data.isODPupilReactionAbnormal && data.odPupilReactionType && data.odPupilReactionType !== "Other");
    
    const osPupilComplete = data.isOSPupilReactionNormal ||
      (data.isOSPupilReactionAbnormal && data.osPupilReactionAbnormal) ||
      (data.isOSPupilReactionAbnormal && data.osPupilReactionType && data.osPupilReactionType !== "Other");

    // Also check Proptosis fields
    const proptosisComplete = 
      typeof data.isProptosisOD === 'boolean' && 
      typeof data.isProptosisOS === 'boolean';

    return odComplete && osComplete && odPupilComplete && osPupilComplete && proptosisComplete;
  };

  const [formData, setFormData] = useState(() => {
    return { ...initialFormData, ...(sectionGData || {}) };
  });

  useEffect(() => {
    if (sectionGData) {
      setFormData(sectionGData);
    }
  }, [sectionGData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleProptosisChange = (e) => {
    const { name, value } = e.target;
    const booleanValue = value === 'true';
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: booleanValue };
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleOcularMovementChange = (eye, value) => {
    const isNormal = value === "normal";
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [`is${eye}ocularmovementNormal`]: isNormal,
        [`is${eye}ocularmovementAbnormal`]: !isNormal,
        [`o${eye}ocularmovementAbnormal`]: !isNormal ? prevData[`o${eye}ocularmovementAbnormal`] : "",
        [`${eye.toLowerCase()}OcularMovementType`]: !isNormal ? prevData[`${eye.toLowerCase()}OcularMovementType`] : "",
        [`extraOcularMovementAbnormalDTO${eye}`]: !isNormal ? prevData[`extraOcularMovementAbnormalDTO${eye}`] : []
      };
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handlePupilReactionChange = (eye, value) => {
    const isNormal = value === "normal";
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [`is${eye}PupilReactionNormal`]: isNormal,
        [`is${eye}PupilReactionAbnormal`]: !isNormal,
        [`o${eye.toLowerCase()}PupilReactionAbnormal`]: !isNormal ? prevData[`o${eye.toLowerCase()}PupilReactionAbnormal`] : "",
        [`${eye.toLowerCase()}PupilReactionType`]: !isNormal ? prevData[`${eye.toLowerCase()}PupilReactionType`] : "",
        [`pupilLightReactionAbnormalDTO${eye}`]: !isNormal ? prevData[`pupilLightReactionAbnormalDTO${eye}`] : []
      };
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleAbnormalityTypeChange = (e, type, eye) => {
    const { value } = e.target;
    const selectedOption = type === 'ocular' ? 
      ocularMovementOptions.find(opt => opt.name === value) :
      pupilReactionOptions.find(opt => opt.name === value);

    setFormData((prevData) => {
      const updatedData = { ...prevData };
      
      if (type === 'ocular') {
        updatedData[`o${eye}ocularmovementAbnormal`] = value === 'Other' ? '' : value;
        updatedData[`${eye.toLowerCase()}OcularMovementType`] = value;
        updatedData[`extraOcularMovementAbnormalDTO${eye}`] = selectedOption ? 
          [{ abnormalTypeId: selectedOption.id }] : [];
      } else {
        updatedData[`o${eye.toLowerCase()}PupilReactionAbnormal`] = value === 'Other' ? '' : value;
        updatedData[`${eye.toLowerCase()}PupilReactionType`] = value;
        updatedData[`pupilLightReactionAbnormalDTO${eye}`] = selectedOption ? 
          [{ abnormalTypeId: selectedOption.id }] : [];
      }
      
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleNextPage = async() => {
    try {
      const payload = {
        registryInfoId: formData.registryInfoId,
        isProptosisOD: formData.isProptosisOD,
        isProptosisOS: formData.isProptosisOS,
        isODocularmovementNormal: formData.isODocularmovementNormal,
        isODocularmovementAbnormal: formData.isODocularmovementAbnormal,
        oDocularmovementAbnormal: formData.oDocularmovementAbnormal,
        isOSocularmovementNormal: formData.isOSocularmovementNormal,
        isOSocularmovementAbnormal: formData.isOSocularmovementAbnormal,
        oSocularmovementAbnormal: formData.oSocularmovementAbnormal,
        isODPupilReactionNormal: formData.isODPupilReactionNormal,
        isODPupilReactionAbnormal: formData.isODPupilReactionAbnormal,
        odPupilReactionAbnormal: formData.odPupilReactionAbnormal,
        isOSPupilReactionNormal: formData.isOSPupilReactionNormal,
        isOSPupilReactionAbnormal: formData.isOSPupilReactionAbnormal,
        osPupilReactionAbnormal: formData.osPupilReactionAbnormal,
        extraOcularMovementAbnormalDTOOD: formData.extraOcularMovementAbnormalDTOOD,
        extraOcularMovementAbnormalDTOOS: formData.extraOcularMovementAbnormalDTOOS,
        pupilLightReactionAbnormalDTOOD: formData.pupilLightReactionAbnormalDTOOD,
        pupilLightReactionAbnormalDTOOS: formData.pupilLightReactionAbnormalDTOOS
      };
      
      // Make the API call
      await dispatch(addExternalExamination(payload)).unwrap();
      
      // Check if form is complete and update status
      if (updateFormStatus) {  // Changed from props.updateFormStatus
        const isComplete = isFormComplete(formData);
        updateFormStatus('External-Examination', true);
      }


      // Navigate to next page
      const nextAlphabet = 'Slit-Lamp-Examination';
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem('selectedAlphabet', nextAlphabet);
      navigate(`/section-${nextAlphabet}`);

      handleNextClick();
    } catch(error) {
      console.error("Error updating registry info:", error);
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionGData(formData));
    handlePreviousClick();
  };

  return (
    <Box sx={{
      padding: 4,
      maxWidth: 1000,
      margin: "auto",
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: "#fff",
      overflowX: "hidden",  // Changed from overflow-x
      WebkitOverflowScrolling: "touch",  // Changed from -webkit-overflow-scrolling
    }}>
      <Typography variant="h6" marginBottom={2}>
        Section G: External Examination
      </Typography>

      <Grid container spacing={3}>
        {/* Proptosis */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Proptosis</Typography>
        </Grid>
        {[
          { label: "OD", key: "OD" },
          { label: "OS", key: "OS" }
        ].map((eye) => (
          <Grid key={eye.key} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye.label}</Typography>
              <RadioGroup
                row
                value={String(formData[`isProptosis${eye.key}`])}
                onChange={handleProptosisChange}
                name={`isProptosis${eye.key}`}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Yes"
                  value="true"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="No"
                  value="false"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}

        {/* Extra Ocular Movement */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Extra Ocular Movement</Typography>
        </Grid>
        {[
          { label: "OD", key: "OD" },
          { label: "OS", key: "OS" }
        ].map((eye) => (
          <Grid key={eye.key} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye.label}</Typography>
              <RadioGroup
                row
                value={formData[`is${eye.key}ocularmovementNormal`] ? "normal" : "abnormal"}
                onChange={(e) => handleOcularMovementChange(eye.key, e.target.value)}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Normal"
                  value="normal"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Abnormal"
                  value="abnormal"
                />
              </RadioGroup>
              {formData[`is${eye.key}ocularmovementAbnormal`] && (
                <>
                  <Select
                    fullWidth
                    value={formData[`${eye.key.toLowerCase()}OcularMovementType`] || ""}
                    onChange={(e) => handleAbnormalityTypeChange(e, 'ocular', eye.key)}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <MenuItem value="">Select Abnormality</MenuItem>
                    {ocularMovementOptions.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData[`${eye.key.toLowerCase()}OcularMovementType`] === "Other" && (
                    <TextField
                      fullWidth
                      label="Specify other abnormality"
                      variant="outlined"
                      name={`o${eye.key}ocularmovementAbnormal`}
                      value={formData[`o${eye.key}ocularmovementAbnormal`] || ""}
                      onChange={handleInputChange}
                    />
                  )}
                </>
              )}
            </FormControl>
          </Grid>
        ))}

        {/* Pupil Reaction to Light */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Pupil Reaction to Light</Typography>
        </Grid>
        {[
          { label: "OD", key: "OD" },
          { label: "OS", key: "OS" }
        ].map((eye) => (
          <Grid key={eye.key} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye.label}</Typography>
              <RadioGroup
                row
                value={formData[`is${eye.key}PupilReactionNormal`] ? "normal" : "abnormal"}
                onChange={(e) => handlePupilReactionChange(eye.key, e.target.value)}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Normal"
                  value="normal"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Abnormal"
                  value="abnormal"
                />
              </RadioGroup>
              {formData[`is${eye.key}PupilReactionAbnormal`] && (
                <>
                <Select
                    fullWidth
                    value={formData[`${eye.key.toLowerCase()}PupilReactionType`] || ""}
                    onChange={(e) => handleAbnormalityTypeChange(e, 'pupil', eye.key)}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <MenuItem value="">Select Abnormality</MenuItem>
                    {pupilReactionOptions.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData[`${eye.key.toLowerCase()}PupilReactionType`] === "Other" && (
                    <TextField
                      fullWidth
                      label="Specify other abnormality"
                      variant="outlined"
                      name={`o${eye.key.toLowerCase()}PupilReactionAbnormal`}
                      value={formData[`o${eye.key.toLowerCase()}PupilReactionAbnormal`] || ""}
                      onChange={handleInputChange}
                    />
                  )}
                </>
              )}
            </FormControl>
          </Grid>
        ))}

        {/* Navigation Buttons */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
          >
            Next Page
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionG;