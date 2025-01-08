import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHospitals } from '../../features/hospitalSlice';
import { fetchPatients } from '../../features/patientsSlice';
import Appbar from '../appbar/Appbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { hospitals, status: hospitalsStatus } = useSelector((state) => state.hospitals);
  const { patients, status: patientsStatus, error } = useSelector((state) => state.patients);
  const [displayedPatients, setDisplayedPatients] = useState([]);

  // Fetch hospitals and patients data on page load
  useEffect(() => {
    if (hospitalsStatus === 'idle') dispatch(fetchHospitals());
    if (patientsStatus === 'idle') dispatch(fetchPatients());
  }, [dispatch, hospitalsStatus, patientsStatus]);

  // Combine patient data with hospital names and set the latest 10 patients
  useEffect(() => {
    if (patients.length && hospitals.length) {
      const enrichedPatients = patients.map((patient) => {
        const hospital = hospitals.find(
          (h) => h.id === patient.hospitalInfoId
        );
        return {
          ...patient,
          hospitalName: hospital ? hospital.hospitalName : 'N/A',
        };
      });

      // Sort by dataCollectionDate and limit to the latest 10
      const sortedPatients = enrichedPatients
        .sort((a, b) => new Date(b.dataCollectionDate) - new Date(a.dataCollectionDate))
        .slice(0, 10);

      setDisplayedPatients(sortedPatients);
    }
  }, [patients, hospitals]);

  // Show loading indicators or errors
  if (patientsStatus === 'loading' || hospitalsStatus === 'loading') {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (patientsStatus === 'failed' || hospitalsStatus === 'failed') {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ fontFamily: 'Roboto', padding: 3 }}>
      <Appbar />
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', marginTop: '60px' }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Hospitals Section */}
        {hospitalsStatus === 'loading' ? (
          <Typography variant="h6" color="textSecondary" sx={{ width: '100%', textAlign: 'center' }}>
            Loading hospitals data...
          </Typography>
        ) : hospitalsStatus === 'succeeded' && hospitals.length === 0 ? (
          <Typography variant="h6" color="textSecondary" sx={{ width: '100%', textAlign: 'center' }}>
            No hospitals found.
          </Typography>
        ) : (
          hospitals.map((hospital) => (
            <Grid item xs={12} sm={6} md={4} key={hospital.id}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={hospital.hospitalName}
                  sx={{ backgroundColor: '#f4f6f8', color: '#3f51b5' }}
                />
                <Divider />
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="textPrimary" gutterBottom>
                      Patients: {patients.filter((p) => p.hospitalId === hospital.id).length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Latest Submissions Section */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#3f51b5', marginTop: '40px' }}
      >
        Latest Patient Submissions
      </Typography>

      {patientsStatus === 'loading' ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
          <CircularProgress />
        </Box>
      ) : patientsStatus === 'failed' ? (
        <Alert severity="error">Error: {error}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Patient Name</strong></TableCell>
                  <TableCell><strong>Age</strong></TableCell>
                  <TableCell><strong>Hospital</strong></TableCell>
                  <TableCell><strong>Data Collection Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.patientName || 'N/A'}</TableCell>
                    <TableCell>{patient.age || 'N/A'}</TableCell>
                    <TableCell>{patient.hospitalName}</TableCell>
                    <TableCell>{new Date(patient.dataCollectionDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;
