import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin, fetchAdmins } from '../../features/adminSlice';
import { fetchHospitals } from '../../features/hospitalSlice';
import AppBar from '../appbar/Appbar';

const AdminManagementPage = () => {
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.admins);
  const { hospitals, status: hospitalsStatus } = useSelector((state) => state.hospitals);

  const [formVisible, setFormVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospitalId: '',
    username: '',
    roleName: 'ADMIN',
    phoneNumber: '',
  });

  // Fetch admins and hospitals on component mount
  useEffect(() => {
    dispatch(fetchAdmins());
    if (hospitalsStatus === 'idle') {
      dispatch(fetchHospitals());
    }
  }, [dispatch, hospitalsStatus]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    dispatch(registerAdmin(formDataToSend)).then(() => {
      dispatch(fetchAdmins()); // Refresh the list after adding an admin
    });

    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      hospitalId: '',
      username: '',
      roleName: 'ADMIN',
      phoneNumber: '',
    });
    setFormVisible(false);
  };

  return (
    <Container>
      <AppBar />

      <Container position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Management Dashboard
          </Typography>
        </Toolbar>
      </Container>

      <Typography variant="h4" gutterBottom>
        Admin Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setFormVisible(!formVisible)}
        sx={{ mb: 2 }}
      >
        {formVisible ? 'Hide Add Admin Form' : 'Add Admin'}
      </Button>

      {formVisible && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Admin
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="hospital-label">Hospital</InputLabel>
                  <Select
                    labelId="hospital-label"
                    value={formData.hospitalId}
                    onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                    required
                  >
                    {hospitalsStatus === 'loading' && (
                      <MenuItem disabled>Loading...</MenuItem>
                    )}
                    {hospitalsStatus === 'succeeded' && hospitals.length === 0 && (
                      <MenuItem disabled>No hospitals available</MenuItem>
                    )}
                    {hospitalsStatus === 'succeeded' && hospitals.map((hospital) => (
                      <MenuItem key={hospital.id} value={hospital.id}>
                        {hospital.hospitalName}  {/* Updated this line */}
                      </MenuItem>
                    ))}
                    {hospitalsStatus === 'failed' && (
                      <MenuItem disabled>Failed to load hospitals</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Register Admin
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        List of Admins
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.userName}</TableCell>
                <TableCell>{admin.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminManagementPage;
