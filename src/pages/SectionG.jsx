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

const SectionG = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sectionGData = useSelector((state) => state.form.sectionG);
  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
  const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));

  const ocularMovementOptions = [
    "Restricted Movement",
    "Complete Paralysis",
    "Partial Paralysis",
    "Nystagmus",
    "Other"
  ];

  const pupilReactionOptions = [
    "Sluggish",
    "Non-reactive",
    "RAPD",
    "Irregular Shape",
    "Other"
  ];

  const initialFormData = {
    // Proptosis - initialize with false (boolean) for radio buttons
    isProptosisOD: false,
    isProptosisOS: false,
    
    // Ocular Movement - initialize with Normal selected
    isODocularmovementNormal: true,
    isODocularmovementAbnormal: false,
    oDocularmovementAbnormal: null,
    isOSocularmovementNormal: true,
    isOSocularmovementAbnormal: false,
    oSocularmovementAbnormal: null,
    
    // Pupil Reaction - initialize with Normal selected
    isODPupilReactionNormal: true,
    isODPupilReactionAbnormal: false,
    odPupilReactionAbnormal: null,
    isOSPupilReactionNormal: true,
    isOSPupilReactionAbnormal: false,
    osPupilReactionAbnormal: null,
    
    // Additional fields
    odOcularMovementType: "",
    osOcularMovementType: "",
    odPupilReactionType: "",
    osPupilReactionType: "",
  };

  const [formData, setFormData] = useState(() => {
    // If there's existing section data, use it; otherwise use initialFormData
    const data = sectionGData || initialFormData;
    // Ensure Proptosis values are booleans
    return {
      ...data,
      isProptosisOD: typeof data.isProptosisOD === 'boolean' ? data.isProptosisOD : false,
      isProptosisOS: typeof data.isProptosisOS === 'boolean' ? data.isProptosisOS : false
    };
  });

  useEffect(() => {
    if (sectionGData) {
      setFormData(prev => ({
        ...sectionGData,
        isProptosisOD: typeof sectionGData.isProptosisOD === 'boolean' ? sectionGData.isProptosisOD : false,
        isProptosisOS: typeof sectionGData.isProptosisOS === 'boolean' ? sectionGData.isProptosisOS : false
      }));
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
        [`o${eye}ocularmovementAbnormal`]: !isNormal ? prevData[`o${eye}ocularmovementAbnormal`] : null,
        // Reset the type when switching back to normal
        [`${eye.toLowerCase()}OcularMovementType`]: isNormal ? "" : prevData[`${eye.toLowerCase()}OcularMovementType`]
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
        [`o${eye.toLowerCase()}PupilReactionAbnormal`]: !isNormal ? prevData[`o${eye.toLowerCase()}PupilReactionAbnormal`] : null,
        // Reset the type when switching back to normal
        [`${eye.toLowerCase()}PupilReactionType`]: isNormal ? "" : prevData[`${eye.toLowerCase()}PupilReactionType`]
      };
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleAbnormalityTypeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      
      // Update the type selection
      updatedData[name] = value;
      
      // Determine which field to update based on the name
      let abnormalityField = '';
      if (name.includes('Ocular')) {
        abnormalityField = `o${name.slice(0, 2)}ocularmovementAbnormal`;
      } else if (name.includes('Pupil')) {
        abnormalityField = `o${name.slice(0, 2).toLowerCase()}PupilReactionAbnormal`;
      }
      
      // Update the abnormality value
      updatedData[abnormalityField] = value === 'Other' ? null : value;
      
      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

  const handleNextPage = async() => {
    try {
      dispatch(saveSectionGData(formData)); 
      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...sectionDData,
        ...sectionEData,
        ...sectionFData,
        ...formData,
        patientInfoId, 
        id 
      };
      
      await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();

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
                value={formData[`isProptosis${eye.key}`].toString()}
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
                    onChange={handleAbnormalityTypeChange}
                    name={`${eye.key.toLowerCase()}OcularMovementType`}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <MenuItem value="">Select Abnormality</MenuItem>
                    {ocularMovementOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
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
                    onChange={handleAbnormalityTypeChange}
                    name={`${eye.key.toLowerCase()}PupilReactionType`}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <MenuItem value="">Select Abnormality</MenuItem>
                    {pupilReactionOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
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