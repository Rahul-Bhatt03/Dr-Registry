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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionGData } from "../features/sectionSlice.js"; 
import { updateDrRegistryInfo } from '../features/updateFormSlice.js'; // Import the update action

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

    // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
    const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
    const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));
 
  
  const [formData, setFormData] = useState(sectionGData || {});

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

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    const booleanValue = value === "true"; // Convert to boolean

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: booleanValue };

      // Handle specific cases for "Normal" and "Abnormal" options to set boolean values
      if (name.includes("ocularmovement")) {
        const eye = name.replace("is", "").replace("ocularmovement", "");
        updatedData[`is${eye}ocularmovementNormal`] = booleanValue;
        updatedData[`is${eye}ocularmovementAbnormal`] = !booleanValue;
        updatedData[`${eye.toLowerCase()}ocularmovementAbnormal`] = !booleanValue
          ? "" : prevData[`${eye.toLowerCase()}ocularmovementAbnormal`];
      }

      if (name.includes("PupilReaction")) {
        const eye = name.replace("is", "").replace("PupilReaction", "");
        updatedData[`is${eye}PupilReactionNormal`] = booleanValue;
        updatedData[`is${eye}PupilReactionAbnormal`] = !booleanValue;
        updatedData[`${eye.toLowerCase()}PupilReactionAbnormal`] = !booleanValue
          ? "" : prevData[`${eye.toLowerCase()}PupilReactionAbnormal`];
      }

      dispatch(saveSectionGData(updatedData));
      return updatedData;
    });
  };

 const handleNextPage = async() => {
     try{
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
       console.log("Section G Payload:", payload);
 
       await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();
 
        // Update the selected alphabet and navigate
        const nextAlphabet = 'Slit-Lamp-Examination';
        setSelectedAlphabet(nextAlphabet);
        localStorage.setItem('selectedAlphabet', nextAlphabet);
        navigate(`/section-${nextAlphabet}`);
 
       handleNextClick(); // Call the function provided by the Layout to navigate
 
     }catch(error){
       console.error("Error updating registry info:", error);
     }
   };

  const handlePreviousPage = () => {
    dispatch(saveSectionGData(formData));
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
      <Typography variant="h6" marginBottom={2}>
        Section G: External Examination
      </Typography>

      <Grid container spacing={3}>
        {/* Proptosis */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Proptosis</Typography>
        </Grid>
        {["od", "os"].map((eye, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye}</Typography>
              <RadioGroup
                row
                value={formData[`isProptosis${eye}`] || false}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Yes"
                  value="true" // Keep value as string for comparison
                  name={`isProptosis${eye}`}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="No"
                  value="false" // Keep value as string for comparison
                  name={`isProptosis${eye}`}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}

        {/* Extra Ocular Movement */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Extra Ocular Movement</Typography>
        </Grid>
        {["od", "os"].map((eye, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye}</Typography>
              <RadioGroup
                row
                value={formData[`is${eye}ocularmovement`] || false}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Normal"
                  value="true" // Keep value as string for comparison
                  name={`is${eye}ocularmovement`}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Abnormal"
                  value="false" // Keep value as string for comparison
                  name={`is${eye}ocularmovement`}
                />
              </RadioGroup>
              <TextField
                fullWidth
                label="Specify abnormal (if any)"
                variant="outlined"
                name={`${eye.toLowerCase()}ocularmovementAbnormal`}
                value={formData[`${eye.toLowerCase()}ocularmovementAbnormal`] || ""}
                onChange={handleInputChange}
                disabled={formData[`is${eye}ocularmovement`] === true}
              />
            </FormControl>
          </Grid>
        ))}

        {/* Pupil Reaction to Light */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Pupil Reaction to Light</Typography>
        </Grid>
        {["od", "os"].map((eye, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="body2">{eye}</Typography>
              <RadioGroup
                row
                value={formData[`is${eye}PupilReaction`] || false}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Normal"
                  value="true" // Keep value as string for comparison
                  name={`is${eye}PupilReaction`}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Abnormal"
                  value="false" // Keep value as string for comparison
                  name={`is${eye}PupilReaction`}
                />
              </RadioGroup>
              <TextField
                fullWidth
                label="Specify abnormal (if any)"
                variant="outlined"
                name={`${eye.toLowerCase()}PupilReactionAbnormal`}
                value={formData[`${eye.toLowerCase()}PupilReactionAbnormal`] || ""}
                onChange={handleInputChange}
                disabled={formData[`is${eye}PupilReaction`] === true}
              />
            </FormControl>
          </Grid>
        ))}

        {/* Previous Page Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handlePreviousPage}
          >
            Previous Page
          </Button>
        </Grid>

        {/* Next Page Button */}
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
