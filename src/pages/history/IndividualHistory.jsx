import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { fetchAllPatients } from "../../features/patientInfoSlice";
import { fetchMunicipalities } from "../../features/locationSlice";
import { useNavigate } from "react-router-dom";
import Appbar from "../appbar/Appbar";

const IndividualHistory = ({ setSelectedAlphabet }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.patientInfo);
  const { municipalities, municipalityLoading } = useSelector((state) => ({
    municipalities: state.location.municipalities || [],
    municipalityLoading: state.location.loading
  }));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    patientName: "",
    phoneNumber: "",
    fatherName: "",
    age: "",
    municipalityName: "",
    dob: "",
  });

  // Keep track of which municipalities we've already fetched
  const [fetchedMunicipalities, setFetchedMunicipalities] = useState(new Set());

  useEffect(() => {
    dispatch(fetchAllPatients({ hospitalId: 1 }));
  }, [dispatch]);

  // Effect to fetch municipalities when patient data changes
  useEffect(() => {
    if (Array.isArray(data)) {
      // Get unique combinations of stateId and districtId from patients
      const municipalitiesToFetch = data.reduce((acc, patient) => {
        if (patient.stateId && patient.districtId) {
          const key = `${patient.stateId}-${patient.districtId}`;
          if (!fetchedMunicipalities.has(key)) {
            acc.push({
              stateId: patient.stateId,
              districtId: patient.districtId,
              key
            });
          }
        }
        return acc;
      }, []);

      // Fetch municipalities for each unique combination
      municipalitiesToFetch.forEach(({ stateId, districtId, key }) => {
        dispatch(fetchMunicipalities({ stateId, districtId }));
        setFetchedMunicipalities(prev => new Set([...prev, key]));
      });
    }
  }, [data, dispatch, fetchedMunicipalities]);

  const handleRowsChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleRowClick = (id) => {
    navigate(`/history?selectedPatient=${id}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      patientName: "",
      phoneNumber: "",
      fatherName: "",
      age: "",
      municipalityName: "",
      dob: "",
    });
  };

  const getMunicipalityName = (municipalityId, stateId, districtId) => {
    if (!Array.isArray(municipalities)) return "N/A";
    
    // Find municipality in the loaded municipalities
    const municipality = municipalities.find(m => 
      m.id === municipalityId && 
      m.stateId === stateId && 
      m.districtId === districtId
    );
    
    return municipality ? municipality.name : "N/A";
  };

  const filteredData = Array.isArray(data)
    ? data.filter((patient) => {
        console.log("Patient municipality:", getMunicipalityName(
          patient.municipalityId,
          patient.stateId,
          patient.districtId
        ));
        
        return Object.keys(filters).every((key) => {
          if (!filters[key]) return true;
          
          if (key === 'municipalityName') {
            const municipalityName = getMunicipalityName(
              patient.municipalityId,
              patient.stateId,
              patient.districtId
            );
            return municipalityName.toLowerCase().includes(filters[key].toLowerCase());
          }
          
          const patientValue = patient[key]?.toString().toLowerCase() || "";
          const filterValue = filters[key].toLowerCase();
          return patientValue.includes(filterValue);
        });
      })
    : [];

  if (loading || municipalityLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Error: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Appbar />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          color: "#1a237e",
          mt: "50px",
        }}
      >
        Patient History
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f3f4f6", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#3949ab", fontWeight: "bold" }}>
          Search Patient
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {Object.keys(filters).map((key) => (
            <TextField
              key={key}
              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flex: "1 1 200px" }}
            />
          ))}
          <Box display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Father Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Municipality Name</TableCell>
                <TableCell>DOB</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.slice(0, rowsPerPage).map((patient) => (
                  <TableRow key={patient.id} hover onClick={() => handleRowClick(patient.id)}>
                    <TableCell>{patient.id || "N/A"}</TableCell>
                    <TableCell>{patient.patientName || "N/A"}</TableCell>
                    <TableCell>{patient.phoneNumber || "N/A"}</TableCell>
                    <TableCell>{patient.fatherName || "N/A"}</TableCell>
                    <TableCell>{patient.age || "N/A"}</TableCell>
                    <TableCell>
                      {getMunicipalityName(
                        patient.municipalityId,
                        patient.stateId,
                        patient.districtId
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.dob ? new Date(patient.dob).toISOString().split("T")[0] : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {Array.isArray(data) && data.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Rows per Page</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                onChange={handleRowsChange}
                label="Rows per Page"
              >
                {[5, 10, 15, 20, 50, 100, 1000].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default IndividualHistory;