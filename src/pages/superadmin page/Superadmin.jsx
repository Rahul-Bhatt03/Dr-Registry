import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Collapse,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Dashboard,
  People,
  LocalHospital,
  Logout,
  Menu as MenuIcon,
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
  Settings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/registerSlice";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
      marginLeft: open ? 0 : `-${drawerWidth}px`,
    },
  }),
);

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const Superadmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.register);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [formVisible, setFormVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    roleName: "GROUPADMIN",
  });

  const mockData = [
    { name: 'Hospitals', count: 12 },
    { name: 'Group Admins', count: 8 },
    { name: 'Admins', count: 24 }
  ];

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (user) {
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        username: "",
        password: "",
        confirmPassword: "",
        roleName: "GROUPADMIN",
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
    setLogoutDialog(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        formPayload.append(key, formData[key]);
      }
    });

    try {
      await dispatch(register(formPayload)).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white'
      }}>
        {isMobile && (
          <IconButton 
            color="inherit"
            onClick={() => setDrawerOpen(false)}
            sx={{ mr: 1 }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>SA</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Super Admin</Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: 'Dashboard', icon: <Dashboard /> },
          { text: 'Hospitals', icon: <LocalHospital /> },
          { text: 'Admins', icon: <People /> },
          { text: 'Settings', icon: <Settings /> }
        ].map((item) => (
          <ListItem 
            button 
            key={item.text}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem 
          button 
          onClick={() => setLogoutDialog(true)}
          sx={{ 
            borderTop: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            }
          }}
        >
          <ListItemIcon>
            <Logout sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: theme.shadows[3]
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Super Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <StyledDrawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerContent />
      </StyledDrawer>

      <Main open={drawerOpen && !isMobile}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            {['Total Hospitals', 'Active Admins', 'Recent Activities'].map((title, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {index === 0 ? '12' : index === 1 ? '32' : '156'}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}

            {/* Chart */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 2, 
                height: { xs: 300, sm: 400 },
                borderRadius: 2,
                boxShadow: theme.shadows[3]
              }}>
                <ResponsiveContainer>
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Registration Form Section */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setFormVisible(!formVisible)}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                {formVisible ? 'Hide Registration Form' : 'Register New Admin'}
              </Button>
              
              <Collapse in={formVisible}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: theme.shadows[3]
                }}>
                  {showSuccessAlert && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Group Admin registered successfully!
                    </Alert>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>
                      {[
                        { label: "Name", name: "name" },
                        { label: "Email", name: "email" },
                        { label: "Phone Number", name: "phoneNumber" },
                        { label: "Username", name: "username" },
                      ].map((field) => (
                        <Grid item xs={12} sm={6} key={field.name}>
                          <TextField
                            fullWidth
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => setFormData({
                              ...formData,
                              [e.target.name]: e.target.value
                            })}
                            variant="outlined"
                            required
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          name="password"
                          value={formData.password}
                          onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                          })}
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
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
                          type={showConfirmPassword ? "text" : "password"}
                          label="Confirm Password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({
                            ...formData,
                            confirmPassword: e.target.value
                          })}
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={loading}
                          sx={{ 
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          }}
                        >
                          {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={20} color="inherit" />
                              <span>Registering...</span>
                            </Box>
                          ) : (
                            "Register Group-Admin"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Collapse>
            </Grid>
          </Grid>
        </Container>
      </Main>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to sign out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Superadmin;