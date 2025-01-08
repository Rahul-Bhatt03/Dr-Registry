import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
  TablePagination,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fetchPatientDetail } from "../../features/patientDetailSlice";
import Appbar from "../appbar/Appbar";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access location object to get query parameters

  // Retrieve patientId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("selectedPatient");

  console.log("Patient ID: ", patientId); // Log the patientId to check if it's being passed

  // Redux selectors for patient detail
  const {  patient: history, status, error } = useSelector((state) => state.patientDetail);

  // Local state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch patient history when component mounts or patientId changes
  useEffect(() => {
    if (patientId && status === "idle") {
      dispatch(fetchPatientDetail(patientId)); // Fetch the patient's history using the patientId
    }
  }, [dispatch, status, patientId]);

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  // Check if history is an array and contains data
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">No treatment records found for this patient</Typography>
      </Box>
    );
  }

  // Pagination logic for history data
  const currentHistory = history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <ThemeProvider theme={theme}>
    <Appbar />
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4, mt: "50px" }}>
      <Container maxWidth="xl">
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Patient History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {history?.length
              ? `Showing ${history.length} treatment record${history.length > 1 ? 's' : ''}`
              : "No treatment history available"}
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Patient ID</strong></TableCell>
                  <TableCell><strong>Hospital ID</strong></TableCell>
                  <TableCell><strong>Enumerator Name</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Dr Registry Id</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentHistory.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.patientInfoId}</TableCell>
                    <TableCell>{record.hospitalInfoId}</TableCell>
                    <TableCell>{record.enumeratorName || 'N/A'}</TableCell>
                    <TableCell>
                      {record.createdDate 
                        ? new Date(record.createdDate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                    <Button
  variant="outlined"
  size="small"
  onClick={() => navigate(`/patient/${record.id}?selectedPatient=${record.id}`)} // Pass the patientId to the URL
>
  View Details
</Button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={history?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Box>
  </ThemeProvider>
  );
};

export default History;
