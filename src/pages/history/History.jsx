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
import { getAllRegistry } from "../../features/historySlice";
import Appbar from "../appbar/Appbar";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get patientId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("selectedPatient");

  // Redux state
  const { data: registryData, loading, error } = useSelector((state) => state.history);

  // Local state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch registry data when component mounts or patientId changes
  useEffect(() => {
    if (patientId) {
      dispatch(getAllRegistry(patientId));
    }
  }, [dispatch, patientId]);

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  // Sort data by dataCollectionDate in descending order
  const sortedData = registryData 
    ? [...registryData].sort((a, b) => 
        new Date(b.dataCollectionDate) - new Date(a.dataCollectionDate)
      )
    : [];

  // Pagination logic
  const currentRegistries = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Appbar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4, mt: "50px" }}>
        <Container maxWidth="xl">
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Patient Registry History
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {sortedData?.length
                ? `Showing ${sortedData.length} record${sortedData.length > 1 ? 's' : ''}`
                : "No registry history available"}
            </Typography>
          </Box>

          <Paper sx={{ p: 3, mb: 4 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Registry ID</strong></TableCell>
                    <TableCell><strong>Collection Date</strong></TableCell>
                    <TableCell><strong>Patient ID</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRegistries.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>
                        {new Date(record.dataCollectionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{record.patientInfoId}</TableCell>
                      <TableCell>{record.status || 'Active'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/patient/${record.id}?selectedPatient=${record.patientInfoId}`)}
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
              count={sortedData?.length || 0}
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