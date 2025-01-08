import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../features/registerSlice.js";  
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #EDE9FF 0%, #F9F3FF 50%, #FFF0F5 100%)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  width: "100%",
  maxWidth: "500px",
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(90deg, #7C3AED, #EC4899)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  fontWeight: 700,
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: theme.spacing(1),
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #7C3AED, #EC4899)",
  color: "white",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  "&:hover": {
    background: "linear-gradient(90deg, #6D31D9, #D93F89)",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
  },
}));

const SignUp = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    UserName: "",
    hospitalId: "",
    RoleName: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Name ||
      !formData.UserName ||
      !formData.Email ||
      !formData.RoleName ||
      !formData.hospitalId ||
      !formData.Password
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.Name);
      formDataToSend.append("Email", formData.Email);
      formDataToSend.append("Password", formData.Password);
      formDataToSend.append("ConfirmPassword", formData.confirmPassword);
      formDataToSend.append("HospitalId", formData.hospitalId);
      formDataToSend.append("UserName", formData.UserName);
      formDataToSend.append("RoleName", formData.RoleName);
      formDataToSend.append("PhoneNumber", formData.phoneNumber);

      const response = await dispatch(register(formDataToSend));
      if (response.payload) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/signIn"), 2000);
      }
    } catch (error) {
      toast.error("Error creating account. Please try again.");
    }
  };

  return (
    <GradientBackground>
      <ToastContainer position="top-center" autoClose={3000} />
      <Container maxWidth="sm" disableGutters={isMobile}>
        <GradientCard>
          <CardContent
            sx={{
              p: { xs: 2, sm: 4 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <GradientTypography variant={isMobile ? "h5" : "h4"}>
              Join Our Community
            </GradientTypography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Create an account to access exclusive features
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              onSubmit={handleSubmit}
            >
              <StyledTextField
                fullWidth
                label="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Username"
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Hospital ID"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                required
              />
              <FormControl fullWidth required>
                <Select
                  name="RoleName"
                  value={formData.RoleName}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Patient">Patient</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <StyledTextField
                fullWidth
                label="Password"
                name="Password"
                type={showPassword ? "text" : "password"}
                value={formData.Password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <GradientButton
                variant="contained"
                type="submit"
                size="large"
                endIcon={<ArrowForward />}
                fullWidth
              >
                Sign Up
              </GradientButton>
            </Box>
          </CardContent>
        </GradientCard>
      </Container>
    </GradientBackground>
  );
};

export default SignUp;
