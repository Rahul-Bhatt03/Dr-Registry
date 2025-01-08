import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertTitle,
  Skeleton,
  Stack,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  Close,
  FileDownload,
  TableChart,
} from "@mui/icons-material";
import { fetchPatientDetail } from "../../features/dataByDrregistryId";
import { updateDrRegistryInfo } from "../../features/updateFormSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Constants for styling edited fields
const EDITED_FIELD_STYLE = {
  backgroundColor: "#fff3e0", // Light orange background for edited fields
  transition: "background-color 0.3s",
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { data: patient, loading, error } = useSelector((state) => state.data);
  
  // Local state
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [originalData, setOriginalData] = useState({}); // Track original values for comparison
  const [showValidationWarning, setShowValidationWarning] = useState(false);


  // Fetch patient details on component mount
  useEffect(() => {
    if (id) dispatch(fetchPatientDetail(id));
  }, [dispatch, id]);

  // Set original data when patient info is loaded
  useEffect(() => {
    if (patient?.drRegistryInfo) {
      setOriginalData(patient.drRegistryInfo);
    }
  }, [patient]);

  // Check if a field has been modified
  const isFieldModified = (fieldName) => {
    return editedData[fieldName] !== originalData[fieldName];
  };

  // Display value formatter with N/A fallback
  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value;
  };

  // Check for empty fields and show warnings
  const checkEmptyFields = () => {
    const emptyFields = Object.entries(editedData)
      .filter(([key, value]) => !value && value !== false)
      .map(([key]) => key);
    
    if (emptyFields.length > 0) {
      setShowValidationWarning(true);
      setValidationErrors(
        emptyFields.reduce((acc, field) => ({
          ...acc,
          [field]: "This field is empty",
        }), {})
      );
    } else {
      setShowValidationWarning(false);
      setValidationErrors({});
    }
    
    // Return true to allow saving regardless of empty fields
    return true;
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedData(patient?.drRegistryInfo || {});
  };

  const handleSave = async () => {
    checkEmptyFields();

    setSaving(true);
    try {
      // Filter out null/undefined values to keep existing data for those fields
      const updatedData = Object.fromEntries(
        Object.entries(editedData).filter(([_, value]) => value !== null && value !== undefined)
      );

      await dispatch(updateDrRegistryInfo({ registryData: updatedData }));
      setEditing(false);
      setOriginalData(editedData);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedData({});
    setValidationErrors({});
    setShowValidationWarning(false);
  };

  const handleChange = (key, value) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
    // Clear validation error when field is modified
    if (validationErrors[key]) {
      setValidationErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setShowValidationWarning(false);
  };

  // Enhanced PDF export with explicit field labels
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Patient Medical Report", 105, 15, { align: "center" });

    // Add timestamp and patient ID
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated: ${timestamp}`, 20, 25);
    doc.text(`Patient ID: ${id}`, 20, 30);

    const tableData = [
      ["Field", "Value"],
      ["Patient Name", displayValue(patient?.name)],
      ["Age", `${displayValue(patient?.age)} years`],
      ["Gender", displayValue(patient?.gender)],
      ["Status", displayValue(patient?.status)],
      // Add registry info with explicit labels
      ...Object.entries(patient?.drRegistryInfo || {}).map(([key, value]) => [
        key.replace(/([A-Z])/g, " $1").trim(), // Convert camelCase to space-separated
        displayValue(value)
      ]),
    ];

    doc.autoTable({
      startY: 35,
      head: [["Field", "Value"]],
      body: tableData.slice(1),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`${patient?.name || "Patient"}-medical-report.pdf`);
  };

  // Enhanced Excel export
  const exportToExcel = () => {
    const data = [
      { Field: "Patient Name", Value: displayValue(patient?.name) },
      { Field: "Age", Value: `${displayValue(patient?.age)} years` },
      { Field: "Gender", Value: displayValue(patient?.gender) },
      { Field: "Status", Value: displayValue(patient?.status) },
      ...Object.entries(patient?.drRegistryInfo || {}).map(([key, value]) => ({
        Field: key.replace(/([A-Z])/g, " $1").trim(),
        Value: displayValue(value)
      })),
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medical Report");
    XLSX.writeFile(wb, `${patient?.name || "Patient"}-medical-report.xlsx`);
  };

  // Helper functions
  const getInitials = (name) => {
    return name
      ? name.split(" ").map((word) => word[0]).join("").toUpperCase()
      : "P";
  };

  const getStatusColor = (status) => {
    const statusMap = {
      active: "success",
      inactive: "default",
      critical: "error",
      stable: "info",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  // Not found state
  if (!patient) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="warning">
          <AlertTitle>Patient Not Found</AlertTitle>
          No patient records found with the provided ID.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h4">Patient Details</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<FileDownload />}
              onClick={exportToPDF}
              variant="outlined"
            >
              Export PDF
            </Button>
            <Button
              startIcon={<TableChart />}
              onClick={exportToExcel}
              variant="outlined"
            >
              Export Excel
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Patient information card */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {getInitials(patient.name)}
                </Avatar>
              }
              title={
                <Typography variant="h6">
                  {displayValue(patient.name)}
                </Typography>
              }
              subheader={`Patient ID: ${id}`}
              action={
                editing ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      onClick={handleSave} 
                      disabled={saving}
                      color="primary"
                    >
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                      <Close />
                    </IconButton>
                  </Stack>
                ) : (
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                )
              }
            />
            <CardContent>
              <Stack spacing={2}>
                {editing ? (
                  // Editing mode - show form fields
                  Object.entries(editedData).map(([key, value]) => (
                    <TextField
                      key={key}
                      label={key.replace(/([A-Z])/g, " $1").trim()}
                      value={value ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      error={!!validationErrors[key]}
                      helperText={validationErrors[key]}
                      fullWidth
                      sx={isFieldModified(key) ? EDITED_FIELD_STYLE : {}}
                    />
                  ))
                ) : (
                  // Display mode - show formatted values
                  <>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Age
                      </Typography>
                      <Typography>{displayValue(patient.age)} years</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography>{displayValue(patient.gender)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={displayValue(patient.status)}
                        color={getStatusColor(patient.status)}
                      />
                    </Box>
                    <Divider />
                    {/* Display registry information */}
                    {Object.entries(patient?.drRegistryInfo || {}).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="body2" color="text.secondary">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Typography>
                        <Typography>{displayValue(value)}</Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDetails;