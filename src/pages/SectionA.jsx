import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Container,
  Paper,
  Divider,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionAData } from "../features/sectionSlice.js";
import { fetchEthnicGroup } from "../features/ethnicGroupSlice.js";
import {
  fetchStates,
  fetchDistricts,
  fetchMunicipalities,
} from "../features/locationSlice";
import { fetchOccupations } from "../features/occupationsSlice.js";
import { addPatientInfo } from "../features/patientInfoSlice.js";
import  addRegistry from "../features/registerSlice.js";
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RegistryForm = ({ selectedAlphabet, setSelectedAlphabet , updateFormStatus, 
  formStatus }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { states, districts, municipalities, loading, error } = useSelector(
    (state) => state.location
  );

  const {
    items: occupations,
    loading: occupationLoading,
    error: occupationError,
  } = useSelector((state) => state.occupations);

  const [formErrors, setFormErrors] = useState({});
  const savedData = useSelector((state) => state.form.sectionA);
  const [formData, setFormData] = useState({
    indexSyncId: null,
    registryIdNo: null,
    patientName: null,
    phoneNumber:null,
    age: null,
    dob: null,
    fatherName: null,
    motherName:null,
    stateId: null,
    districtId:null,
    municipalityId: null,
    wardNo: null,
    tole:null,
    gender: null,
    ethnicGroupId: null,
    education: null,
    occupationId: null,
  });

  const validateForm = () => {
    const errors = {};
    // Required fields validation
    if (!formData.patientName) errors.patientName = "Patient name is required";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.ethnicGroupId) errors.ethnicGroupId = "Ethnic group is required";
    if (!formData.stateId) errors.stateId = "State is required";
    if (!formData.districtId) errors.districtId = "District is required";
    if (!formData.municipalityId) errors.municipalityId = "Municipality is required";
    if (!formData.wardNo) errors.wardNo = "Ward number is required";
    if (!formData.education) errors.education = "Education is required";
    if (!formData.occupationId) errors.occupationId = "Occupation is required";

    // Phone number validation
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    // Age validation
    if (formData.age && (formData.age < 0 || formData.age > 120)) {
      errors.age = "Age must be between 0 and 120";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const educationOptions = [
    { id: 1, label: "Illiterate" },
    { id: 2, label: "Primary" },
    { id: 3, label: "Secondary" },
    { id: 4, label: "Higher Secondary and above" },
  ];

  const { items: ethnicGroups } = useSelector((state) => state.ethnicGroups);
  const [selectedEthnicGroup, setSelectedEthnicGroup] = useState("");
  const [showOtherEthnicGroups, setShowOtherEthnicGroups] = useState(false);

    // Effect to check form completion status
    useEffect(() => {
      const isFormComplete = validateForm();
      // Only update if the form status has changed
      if (formStatus['Demographic-History'] !== isFormComplete) {
        updateFormStatus('Demographic-History', isFormComplete);
      }
    }, [formData, updateFormStatus]);

  useEffect(() => {
    dispatch(fetchOccupations());
  }, [dispatch]);

  const handleOccupationChange = (e) => {
    setFormData({
      ...formData,
      occupationId: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (formData.stateId) {
      dispatch(fetchDistricts({ stateId: formData.stateId }));
    }
  }, [formData.stateId, dispatch]);

  useEffect(() => {
    if (formData.districtId) {
      dispatch(
        fetchMunicipalities({
          stateId: formData.stateId,
          districtId: formData.districtId,
        })
      );
    }
  }, [formData.districtId, dispatch]);

  useEffect(() => {
    dispatch(fetchEthnicGroup());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
    }
    const savedAlphabet = localStorage.getItem("selectedAlphabet") || "Demographic-History";
    setSelectedAlphabet(savedAlphabet);
  }, [savedData, setSelectedAlphabet]);

  const genderIdMap = {
    male: 1,
    female: 2,
    others: 3,
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    // Validate age range
    if (age < 0 || age > 120) return null;
    return age;
  };

  const handleChange = (field, value) => {
    // Clear error for the field being changed
    setFormErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  
    // Special handling for different field types
    let updatedValue = value;
  
    switch (field) {
      case "dob":
        const calculatedAge = calculateAge(value);
        // Update form data with both dob and calculated age
        setFormData(prev => ({
          ...prev,
          dob: value ? new Date(value).toISOString() : null,
          age: calculatedAge
        }));
        
        // Update Redux store
        dispatch(saveSectionAData({
          ...formData,
          dob: value ? new Date(value).toISOString() : null,
          age: calculatedAge
        }));
        return; // Exit early as we've handled the update
  
      case "phoneNumber":
        updatedValue = String(value);
        break;
  
      case "gender":
        updatedValue = genderIdMap[value];
        break;
  
      case "age":
        // Prevent manual age changes as it's calculated from DOB
        return;
  
      case "education":
        updatedValue = parseInt(value);
        break;
  
      // Handle fields that should be cleared when parent field changes
      case "stateId":
        setFormData(prev => ({
          ...prev,
          stateId: value,
          districtId: null,
          municipalityId: null
        }));
        
        dispatch(saveSectionAData({
          ...formData,
          stateId: value,
          districtId: null,
          municipalityId: null
        }));
        return;
  
      case "districtId":
        setFormData(prev => ({
          ...prev,
          districtId: value,
          municipalityId: null
        }));
        
        dispatch(saveSectionAData({
          ...formData,
          districtId: value,
          municipalityId: null
        }));
        return;
  
      default:
        // For all other fields, use the value as is
        updatedValue = value === "" || value === undefined || value === null
          ? null
          : value;
    }
  
    // Update local state
    setFormData(prev => ({
      ...prev,
      [field]: updatedValue
    }));
  
    // Update Redux store
    dispatch(saveSectionAData({
      ...formData,
      [field]: updatedValue
    }));
  };
  

  const handleEthnicGroupChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, ethnicGroup: value }));
    if (value === "others") {
      setShowOtherEthnicGroups(true);
    } else {
      setShowOtherEthnicGroups(false);
      setSelectedEthnicGroup(value);
    }
  };

  const handleNextPage = async () => {
    try {
      if (!validateForm()) {
        toast.error("Please fill in all required fields correctly", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
  
      // First API call - Patient Info
      const patientInfoResponse = await dispatch(addPatientInfo(formData)).unwrap();
      
      // Check if we have a valid response
      if (!patientInfoResponse) {
        throw new Error("Failed to add patient info - no response received");
      }
  
      const patientInfoId = patientInfoResponse;
      console.log('Patient Info Response:', patientInfoResponse);
      
      // Store patient ID in localStorage
      localStorage.setItem("currentpatientInfoId", patientInfoId.toString());
  
      // Prepare data for registry API
      const registryData = {
        patientInfoId: parseInt(patientInfoId),
        dataCollectionDate: new Date().toISOString()
      };
  
      // Second API call - Registry
      const registryResponse = await dispatch(addRegistry(registryData)).unwrap();
      console.log('Registry Response:', registryResponse);
      // Check if we have a valid response
      if (!registryResponse) {
        throw new Error("Failed to add registry - no response received");
      }
  
      const registryId = registryResponse;
  
      // Store registry ID in localStorage
      localStorage.setItem("registryInfoId", registryId.toString());
  
      // Success notification
      toast.success("Registration completed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Clean up old registry ID if exists
      if (localStorage.getItem("DrRegistryId")) {
        localStorage.removeItem("DrRegistryId");
      }
  
      // Navigate to next page
      const nextPage = "Medical-History";
      setSelectedAlphabet(nextPage);
      localStorage.setItem("selectedAlphabet", nextPage);
  
      navigate(`/section-${nextPage}`, {
        state: {
          patientInfoId: parseInt(patientInfoId),
          registryInfoId: parseInt(registryId)
        }
      });
  
    } catch (error) {
      console.error("Registration process failed:", error);
      
      // More specific error message
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          "Registration failed. Please try again.";
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
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

  const commonSelectProps = {
    fullWidth: true,
    size: "medium",
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 1,
      },
      maxWidth: "300px", 
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Section: {selectedAlphabet.toUpperCase()}
          </Typography>
          <Typography variant="h3" gutterBottom>
           Patient Registration
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Registry Site"
              value={formData.registrySite||null}
              onChange={(e) => handleChange("registrySite", e.target.value)}
            />
          </Grid>  */}

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="dob"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dob ? formData.dob.split("T")[0] : null}
              onChange={(e) => handleChange("dob", e.target.value)}
              error={!!formErrors.dob}
              helperText={formErrors.dob}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Registry ID No"
              value={formData.registryIdNo||null}
              onChange={(e) => handleChange("registryIdNo", e.target.value)}
            />
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mt: 2 }}
            >
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Patient Name"
              value={formData.patientName}
              onChange={(e) => handleChange("patientName", e.target.value)}
              error={!!formErrors.patientName}
              helperText={formErrors.patientName}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
    <TextField
      {...commonTextFieldProps}
      label="Age"
      type="number"
      value={formData.age || null}
      InputProps={{
        readOnly: true,
      }}
      helperText="Auto-calculated from date of birth"
    />
  </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="phone number"
              type="number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl component="fieldset">
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                value={
                  Object.keys(genderIdMap).find(
                    (key) => genderIdMap[key] === parseInt(formData.gender)
                  ) || null
                }
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="others"
                  control={<Radio />}
                  label="Others"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Ethnic Group */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mt: 2 }}
            >
              Ethnic Group
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl {...commonSelectProps}>
              <InputLabel>Ethnic Group</InputLabel>
              <Select
                value={formData.ethnicGroupId || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedGroup = ethnicGroups.find(
                    (group) => group.id === selectedId
                  );
                  setFormData((prev) => ({
                    ...prev,
                    ethnicGroupId: selectedId,
                  }));
                  setSelectedEthnicGroup(selectedGroup?.name || null);
                }}
              >
                {ethnicGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Family Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mt: 2 }}
            >
              Family Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Father's Name"
              value={formData.fatherName}
              onChange={(e) => handleChange("fatherName", e.target.value)}
              error={!!formErrors.fatherName}
              helperText={formErrors.fatherName}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Mother's Name"
              value={formData.motherName}
              onChange={(e) => handleChange("motherName", e.target.value)}
            />
          </Grid>

          {/* Fixed Address Information Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mt: 2 }}
            >
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl {...commonSelectProps}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                value={formData.stateId || null}
                onChange={(e) => handleChange("stateId", e.target.value)}
                error={!!formErrors.stateId}
                helperText={formErrors.stateId}
                required
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl {...commonSelectProps}>
              <InputLabel>District</InputLabel>
              <Select
                value={formData.districtId}
                onChange={(e) => handleChange("districtId", e.target.value)}
                label="District"
                disabled={!formData.stateId}
                error={!!formErrors.districtId}
                helperText={formErrors.districtId}
                required
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl {...commonSelectProps}>
              <InputLabel>Municipality</InputLabel>
              <Select
              required
                value={formData.municipalityId}
                onChange={(e) => handleChange("municipalityId", e.target.value)}
                label="Municipality"
                disabled={!formData.districtId}
                error={!!formErrors.municipalityId}
                helperText={formErrors.municipalityId}
             
              >
                {municipalities.map((municipality) => (
                  <MenuItem key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonSelectProps}
              label="Ward No"
              type="number"
              value={formData.wardNo}
              onChange={(e) => handleChange("wardNo", parseInt(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonSelectProps}
              label="Tole"
              value={formData.tole}
              onChange={(e) => handleChange("tole", e.target.value)}
            />
          </Grid>

          {/* Education and Occupation */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mt: 2 }}
            >
              Education and Occupation
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined" {...commonSelectProps}>
              <InputLabel>Education</InputLabel>
              <Select
                value={formData.education !== null ? formData.education : ""}
                onChange={(e) => handleChange("education", e.target.value)}
                label="Education"
              >
                {educationOptions.map(({ id, label }) => (
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Occupation Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined" {...commonSelectProps}>
              <InputLabel>Occupation</InputLabel>
              <Select
                value={formData.occupationId}
                onChange={handleOccupationChange}
                disabled={loading}
                label="Occupation"
                
              >
                {loading ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : error ? (
                  <MenuItem disabled>Error loading occupations</MenuItem>
                ) : (
                  occupations.map((occupation) => (
                    <MenuItem key={occupation.id} value={occupation.id}>
                      {occupation.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Next Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 4,
              marginLeft: "50px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              size="large"
            >
           Submit
            </Button>
          </Box>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RegistryForm;
