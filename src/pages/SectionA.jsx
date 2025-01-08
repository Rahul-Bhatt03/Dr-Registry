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
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



const RegistryForm = ({ selectedAlphabet, setSelectedAlphabet }) => {
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

  const educationOptions = [
    { id: 1, label: "Illiterate" },
    { id: 2, label: "Primary" },
    { id: 3, label: "Secondary" },
    { id: 4, label: "Higher Secondary and above" },
  ];

  const { items: ethnicGroups } = useSelector((state) => state.ethnicGroups);
  const [selectedEthnicGroup, setSelectedEthnicGroup] = useState("");
  const [showOtherEthnicGroups, setShowOtherEthnicGroups] = useState(false);

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

  const handleChange = (field, value) => {
    // Update local state
    console.log(field)
    console.log(value)
    const updatedValue =
    value === "" || value === undefined || value === null
      ? null
      : field === "dob"
      ? new Date(value).toISOString()
      : field === "gender"
      ? genderIdMap[value]
      :field==='phoneNumber'
      ?String(value)
      : value;
    setFormData((prev) => ({
      ...prev,
      [field]: updatedValue,
      [field]: field === "education" ? educationOptions.filter((e)=>e.id==value).label: value,
      [field]: field === "gender" ? genderIdMap[value] : value,
      ...(field === "stateId" && { districtId: "", municipalityId: "" }),
      ...(field === "districtId" && { municipalityId: "" }),
    }));

    if (field === "education") {
      dispatch(saveSectionAData({ ...formData, }));
    } else {
      dispatch(saveSectionAData({ ...formData, [field]: updatedValue }));
    }

    if (field === "dob") {
      dispatch(saveSectionAData({ ...formData, dob: updatedValue }));
    } else {
      dispatch(saveSectionAData({ ...formData, [field]: value }));
    }

    // Update Redux store for location-specific fields
    if (field === "stateId") {
      dispatch(
        saveSectionAData({
          ...formData,
          stateId: value,
          districtId: "",
          municipalityId: "",
        })
      );
    }
    if (field === "districtId") {
      dispatch(
        saveSectionAData({ ...formData, districtId: value, municipalityId: "" })
      );
    }
    if (field === "municipalityId") {
      dispatch(saveSectionAData({ ...formData, municipalityId: value }));
    }

    // Update Redux store for gender
    if (field === "gender") {
      dispatch(saveSectionAData({ ...formData, gender: genderIdMap[value] }));
    }
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

  const handleNextPage = () => {
    const alphabets = [
      "Demographic-History",
      "Medical-History",
      "Smoking-History",
      "Systemic-Complications",
      "Investigation",
      "Ocular-History",
      "External-Examination",
      "Slit-Lamp-Examination",
      "Fundus-Examination",
      "DIABETIC-RETINOPATHY",
    ];
    const currentIndex = alphabets.indexOf(selectedAlphabet);
    const nextAlphabet =
      currentIndex < alphabets.length - 1
        ? alphabets[currentIndex + 1]
        : alphabets[0];
  
    dispatch(addPatientInfo(formData))
      .unwrap()
      .then((response) => {
        // Log the response for verification
        console.log("API Response:", response);
        const patientInfoId = response; 
        if (patientInfoId) {
          dispatch(saveSectionAData({ ...formData, patientInfoId }));
          localStorage.setItem("currentpatientInfoId", patientInfoId);
          console.log("Saved Patient ID:", patientInfoId);
  
          // Check for DrRegistryId in localStorage and remove it if present
          if (localStorage.getItem("DrRegistryId")) {
            localStorage.removeItem("DrRegistryId");
            console.log("DrRegistryId removed from localStorage");
          }
  
          // Display success toast notification
          toast.success("Patient registered successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
  
        // Navigate to the next section
        setSelectedAlphabet(nextAlphabet);
        localStorage.setItem("selectedAlphabet", nextAlphabet);
        navigate(`/section-${nextAlphabet}`);
      })
      .catch((error) => {
        // Log and notify user of the error
        console.error("Failed to register patient info:", error);
  
        const errorMessage =
          error.message || "An error occurred while saving the patient info";
  
        // Display error toast notification
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      });
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

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Registry Site"
              value={formData.registrySite||null}
              onChange={(e) => handleChange("registrySite", e.target.value)}
            />
          </Grid> 

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="dob"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dob ? formData.dob.split("T")[0] : null}
              onChange={(e) => handleChange("dob", e.target.value)}
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
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="Age"
              type="number"
              value={parseInt(formData.age)}
              onChange={(e) => handleChange("age", parseInt(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...commonTextFieldProps}
              label="phone number"
              type="number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
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

          {/* {loading && <Grid item xs={12}><CircularProgress /></Grid>}
          {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>} */}

          <Grid item xs={12} sm={6} md={4}>
            <FormControl {...commonSelectProps}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
              required
                labelId="state-label"
                value={formData.stateId || null}
                onChange={(e) => handleChange("stateId", e.target.value)}
              >
                {/* <MenuItem value="">
      <em>None</em>
    </MenuItem> */}
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
              required
                value={formData.districtId}
                onChange={(e) => handleChange("districtId", e.target.value)}
                label="District"
                disabled={!formData.stateId}
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
