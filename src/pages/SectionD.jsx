import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveSectionDData } from "../features/sectionSlice.js";
import {
  fetchSystemicComplications,
  addSystemicComplication,
} from "../features/systemicComplicationsSlice.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SectionD = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus,
  formStatus,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});

  // Redux selectors
  const { data: complicationsList, loading } = useSelector(
    (state) => state.systemicComplications
  );
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);

  // Get IDs from localStorage
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const registryInfoId = parseInt(
    sectionBData.DrRegistryId || localStorage.getItem("DrRegistryId")
  );

  // Form state
  const [formData, setFormData] = useState({
    systemicComplicationDetailDTOs: [],
    isSubmitted: false, // Add this to track submission status
  });

  // Initialize form data from Redux store
  useEffect(() => {
    if (sectionDData?.systemicComplicationDetailDTOs) {
      setFormData(prevData => ({
        ...prevData,
        systemicComplicationDetailDTOs: sectionDData.systemicComplicationDetailDTOs,
        isSubmitted: sectionDData.isSubmitted || false,
      }));
    }
  }, [sectionDData]);

  // Fetch complications on mount
  useEffect(() => {
    dispatch(fetchSystemicComplications());
  }, [dispatch]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.systemicComplicationDetailDTOs?.length) {
      errors.systemicComplicationDetailDTOs = "Please select at least one complication";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Effect to check form completion status
  useEffect(() => {
    const isFormComplete = validateForm() && formData.isSubmitted;
    if (formStatus["Systemic-Complications"] !== isFormComplete) {
      updateFormStatus("Systemic-Complications", isFormComplete);
    }
  }, [formData, formStatus, updateFormStatus]);

  // Handle checkbox changes
  const handleComplicationChange = (complicationId) => {
    setFormData((prevData) => {
      const currentDTOs = prevData.systemicComplicationDetailDTOs || [];
      const existingIndex = currentDTOs.findIndex(
        (dto) => dto.systemicOtherComplicationsInfoId === complicationId
      );

      let newDTOs;
      if (existingIndex >= 0) {
        newDTOs = currentDTOs.filter((_, index) => index !== existingIndex);
      } else {
        newDTOs = [
          ...currentDTOs,
          { systemicOtherComplicationsInfoId: complicationId },
        ];
      }

      const updatedData = {
        ...prevData,
        systemicComplicationDetailDTOs: newDTOs,
      };

      // Update Redux store
      dispatch(saveSectionDData(updatedData));
      return updatedData;
    });
  };

  // Handle next page navigation
  const handleNextPage = async () => {
    try {
      if (!validateForm()) {
        toast.error("Please select at least one complication", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const payload = {
        id: 0,
        registryInfoId,
        patientInfoId,
        systemicComplicationDetailDTOs: formData.systemicComplicationDetailDTOs,
      };

      await dispatch(addSystemicComplication(payload)).unwrap();
      
      // Update form status after successful submission
      const updatedFormData = {
        ...formData,
        isSubmitted: true,
      };
      
      setFormData(updatedFormData);
      dispatch(saveSectionDData(updatedFormData));
      
      // Ensure form status is updated before navigation
      updateFormStatus("systemic-complications", true);
      
      // Navigate to next section
      handleNextClick();
    } catch (error) {
      console.error("Error adding systemic complications:", error);
      toast.error("Failed to save complications. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionDData(formData));
    handlePreviousClick();
  };

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
        Section D: Systemic Other Complications of Diabetes
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl 
            component="fieldset" 
            fullWidth 
            error={!!formErrors.systemicComplicationDetailDTOs}
          >
            <FormLabel component="legend">
              Select Systemic Complications
            </FormLabel>
            {loading ? (
              <CircularProgress />
            ) : (
              <FormGroup>
                {complicationsList.map((complication) => (
                  <FormControlLabel
                    key={complication.id}
                    control={
                      <Checkbox
                        checked={formData.systemicComplicationDetailDTOs.some(
                          (dto) =>
                            dto.systemicOtherComplicationsInfoId === complication.id
                        )}
                        onChange={() => handleComplicationChange(complication.id)}
                      />
                    }
                    label={complication.name}
                  />
                ))}
              </FormGroup>
            )}
            {formErrors.systemicComplicationDetailDTOs && (
              <Typography color="error" variant="caption">
                {formErrors.systemicComplicationDetailDTOs}
              </Typography>
            )}
          </FormControl>
        </Grid>

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
              disabled={loading}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionD;