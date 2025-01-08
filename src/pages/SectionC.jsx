import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveSectionCData } from '../features/sectionSlice.js';
import { updateDrRegistryInfo } from "../features/updateFormSlice.js";

const SectionC = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sectionAData = useSelector((state) => state.form.sectionA);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);
  const drRegistryStatus = useSelector((state) => state.drRegistry.status);
  const drRegistryError = useSelector((state) => state.drRegistry.error);

  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
  const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));

  const [formData, setFormData] = React.useState({
    smokingHistoryType: parseInt(sectionCData.smokingHistoryType) || 1,
    pastSmokerStartedAge: parseInt(sectionCData.pastSmokerStartedAge) || null,
    currentSmokerStartedAge: parseInt(sectionCData.currentSmokerStartedAge) || null,
    quitSmokingYear: parseInt(sectionCData.quitSmokingYear) || null,
    averageNoCigrate: parseInt(sectionCData.averageNoCigrate) || null,
    yearsSmoked: parseInt(sectionCData.yearsSmoked) || null,
    isSmokerInHouse: Boolean(sectionCData.isSmokerInHouse) || false,
    alcoholicHistoryType: parseInt(sectionCData.alcoholicHistoryType) || 1,
    alcoholType: sectionCData.alcoholType || null,
    isOccasionalDrinker: Boolean(sectionCData.isOccasionalDrinker) || false,
    isSocialDrinker: Boolean(sectionCData.isSocialDrinker) || false,
    isChronicDrinker: Boolean(sectionCData.isChronicDrinker) || false,
    drinkingDuration: parseInt(sectionCData.drinkingDuration) || null,
    stopDrinkDuration: parseInt(sectionCData.stopDrinkDuration) || null,
    ageDuringStartAlcohol: parseInt(sectionCData.ageDuringStartAlcohol) || null,
    quantityPerWeek: parseInt(sectionCData.quantityPerWeek) || null,
  });

  useEffect(() => {
    setFormData({
      smokingHistoryType: parseInt(sectionCData.smokingHistoryType) || 1,
      pastSmokerStartedAge: parseInt(sectionCData.pastSmokerStartedAge) || null,
      currentSmokerStartedAge: parseInt(sectionCData.currentSmokerStartedAge) || null,
      quitSmokingYear: parseInt(sectionCData.quitSmokingYear) || null,
      averageNoCigrate: parseInt(sectionCData.averageNoCigrate) || null,
      yearsSmoked: parseInt(sectionCData.yearsSmoked) || null,
      isSmokerInHouse: Boolean(sectionCData.isSmokerInHouse) || false,
      alcoholicHistoryType: parseInt(sectionCData.alcoholicHistoryType) || 1,
      alcoholType: sectionCData.alcoholType || null,
      isOccasionalDrinker: Boolean(sectionCData.isOccasionalDrinker) || false,
      isSocialDrinker: Boolean(sectionCData.isSocialDrinker) || false,
      isChronicDrinker: Boolean(sectionCData.isChronicDrinker) || false,
      drinkingDuration: parseInt(sectionCData.drinkingDuration) || null,
      stopDrinkDuration: parseInt(sectionCData.stopDrinkDuration) || null,
      ageDuringStartAlcohol: parseInt(sectionCData.ageDuringStartAlcohol) || null,
      quantityPerWeek: parseInt(sectionCData.quantityPerWeek) || null,
    });
  }, [sectionCData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      dispatch(saveSectionCData(updatedData));
      return updatedData;
    });
  };

  const handleNextPage = async () => {
    try {
      const token = localStorage.getItem("token");
      const combinedData = {
        patientInfoId,
        id,
        ...sectionBData,
        ...formData,
      };
      await dispatch(updateDrRegistryInfo({ registryData: combinedData, token })).unwrap();
      handleNextClick();
    } catch (error) {
      console.error("Error updating registry info:", error);
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionCData(formData));
    handlePreviousClick();
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
        Section C: Smoking History
      </Typography>

      <Grid container spacing={3}>
        {/* Initial Smoking History Question */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>
              Have you ever smoked cigarettes on a regular basis?
            </FormLabel>
            <RadioGroup
              row
              name="smokingHistoryType"
              value={formData.smokingHistoryType}
              onChange={handleInputChange}
            >
              <FormControlLabel value={1} control={<Radio />} label="Never smoked" />
              <FormControlLabel value={2} control={<Radio />} label="Past smoker" />
              <FormControlLabel value={3} control={<Radio />} label="Current smoker" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Household Smoking Question - Always visible */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>
              Did someone in the household you grew up in smoke regularly?
            </FormLabel>
            <RadioGroup
              row
              name="isSmokerInHouse"
              value={formData.isSmokerInHouse}
              onChange={handleInputChange}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Past Smoker Fields */}
        {formData.smokingHistoryType === 2 && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How old were you when you started?"
                type="number"
                variant="outlined"
                name="pastSmokerStartedAge"
                value={formData.pastSmokerStartedAge}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of years smoked"
                type="number"
                variant="outlined"
                name="yearsSmoked"
                value={formData.yearsSmoked}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Year quit"
                type="number"
                variant="outlined"
                name="quitSmokingYear"
                value={formData.quitSmokingYear}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {/* Current Smoker Fields */}
        {formData.smokingHistoryType === 3 && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Average number of cigarettes/day"
                type="number"
                variant="outlined"
                name="averageNoCigrate"
                value={formData.averageNoCigrate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of years smoked"
                type="number"
                variant="outlined"
                name="yearsSmoked"
                value={formData.yearsSmoked}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {/* Alcohol History Section */}
        <Grid item xs={12}>
          <Typography variant="h6" marginTop={4} marginBottom={2}>
            Section C: Alcohol History
          </Typography>
        </Grid>

        {/* Initial Alcohol History Question - Always visible */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>
              Do you drink alcoholic beverages?
            </FormLabel>
            <RadioGroup
              row
              name="alcoholicHistoryType"
              value={formData.alcoholicHistoryType}
              onChange={handleInputChange}
            >
              <FormControlLabel value={1} control={<Radio />} label="Never" />
              <FormControlLabel value={2} control={<Radio />} label="Present drinker" />
              <FormControlLabel value={3} control={<Radio />} label="Past drinker" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Past Drinker Fields */}
        {formData.alcoholicHistoryType === 3 && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Duration since stopped drinking (in years)"
              type="number"
              variant="outlined"
              name="stopDrinkDuration"
              value={formData.stopDrinkDuration}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {/* Present Drinker Fields */}
        {formData.alcoholicHistoryType === 2 && (
          <>
            {/* Beverage Type Selection */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Type of alcoholic beverage:</FormLabel>
                <RadioGroup
                  row
                  name="alcoholType"
                  value={formData.alcoholType}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="beer" control={<Radio />} label="Beer" />
                  <FormControlLabel value="wine" control={<Radio />} label="Wine" />
                  <FormControlLabel value="liquor" control={<Radio />} label="Liquor" />
                  <FormControlLabel value="Brandy" control={<Radio />} label="Brandy" />
                  <FormControlLabel value="Rum" control={<Radio />} label="Rum" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Drinking Pattern Options */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Occasional Drinker</FormLabel>
                <RadioGroup
                  row
                  name="isOccasionalDrinker"
                  value={formData.isOccasionalDrinker}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Social Drinker</FormLabel>
                <RadioGroup
                  row
                  name="isSocialDrinker"
                  value={formData.isSocialDrinker}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Chronic Drinker</FormLabel>
                <RadioGroup
                  row
                  name="isChronicDrinker"
                  value={formData.isChronicDrinker}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration of drinking (in years)"
                type="number"
                variant="outlined"
                name="drinkingDuration"
                value={formData.drinkingDuration}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age when you started drinking"
                type="number"
                variant="outlined"
                name="ageDuringStartAlcohol"
                value={formData.ageDuringStartAlcohol}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity per week (in ml)"
                type="number"
                variant="outlined"
                name="quantityPerWeek"
                value={formData.quantityPerWeek}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {/* Navigation Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" marginTop={3}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNextPage}
              disabled={drRegistryStatus === 'loading'}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionC;