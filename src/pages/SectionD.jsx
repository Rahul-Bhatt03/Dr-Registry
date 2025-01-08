import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { saveSectionDData } from '../features/sectionSlice.js'; // Adjust path as needed
import { fetchSystemicComplications } from '../features/systemicComplicationsSlice.js';
import { updateDrRegistryInfo } from '../features/updateFormSlice.js'; // Import the update action

const SectionD = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve systemic complications data and loading state from Redux store
  const { data: complicationsList, loading } = useSelector(
    (state) => state.systemicComplications
  );

  // Retrieve section D data from Redux store
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
  const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));

  // Local state for managing the form data
  const [formData, setFormData] = useState({
    systemicOtherComplicationsInfoId: null,
  });

  // Fetch complications on mount
  useEffect(() => {
    dispatch(fetchSystemicComplications());
  }, [dispatch]);

  // Populate local state with data from Redux store
  useEffect(() => {
    if (sectionDData) {
      setFormData(sectionDData);
    }
  }, [sectionDData]);

  // Handle form field changes and update Redux store
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      dispatch(saveSectionDData(updatedData)); // Save data to Redux on every change
      return updatedData;
    });
  };

  const handleComplicationChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      complications: value,
      otherComplications: value === 'other' ? formData.otherComplications : '',
    });
    dispatch(saveSectionDData({
      ...formData,
      complications: value,
      otherComplications: value === 'other' ? formData.otherComplications : '',
    }));
  };



  // Updated handleNextPage to call the update endpoint before navigation
  const handleNextPage = async () => {
    try {
      // Combine data from sectionB, sectionC, formData, and necessary identifiers
      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...formData,
        patientInfoId,
       id,
      };
console.log("section D payloads",payload)
      // Dispatch the update action and wait for the result
      await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();

      // Update the selected alphabet and navigate
      const nextAlphabet = 'Investigation';
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem('selectedAlphabet', nextAlphabet);
      navigate(`/section-${nextAlphabet}`);
    } catch (error) {
      console.error("Error updating data:", error);
      // Optionally handle error (e.g., show a notification)
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionDData(formData)); // Ensure data is saved before navigation
    handlePreviousClick(); // Call the function provided by the Layout to navigate
  };

  const handleAlphabetClick = (alphabet) => {
    setSelectedAlphabet(alphabet);
    localStorage.setItem('selectedAlphabet', alphabet);
    navigate(`/section-${alphabet.toUpperCase()}`);
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" marginBottom={2}>
        Section D: Systemic Other Complications of Diabetes
      </Typography>

      <Grid container spacing={3}>
        {/* Dropdown for systemic complications */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Systemic Other Complications</FormLabel>
            {loading ? (
              <CircularProgress />
            ) : (
              <Select
                name="systemicOtherComplicationsInfoId"
                value={formData.systemicOtherComplicationsInfoId}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select a complication
                </MenuItem>
                {complicationsList.map((complication) => (
                  <MenuItem key={complication.id} value={complication.id}>
                    {complication.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </Grid>

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

export default SectionD;
