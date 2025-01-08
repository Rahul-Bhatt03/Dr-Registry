import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";  // Import useDispatch from react-redux
import { login } from "../../features/authSlice";  // Import the login action

// Styled components (same as your SignUp page)
const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #D8B4FE, #FBCFE8)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  width: "100%",
  maxWidth: "400px",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
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

const SignIn = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Initialize dispatch

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const credentials = { UserName: userName, Password: password };
      const result = await dispatch(login(credentials)).unwrap(); // Unwraps the action's payload
      // Check the role of the user and navigate accordingly
      if (result.roles.includes("SUPERADMIN")) {
        navigate("/superadmin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(`Login failed: ${error}`);
    }
  };

  
  

  return (
    <GradientBackground>
      <Container maxWidth="sm" disableGutters={isMobile}>
        <StyledCard>
          <CardContent sx={{ p: { xs: 2, sm: 4 }, display: "flex", flexDirection: "column", gap: 2 }}>
            <StyledTypography variant={isMobile ? "h5" : "h4"}>Sign In</StyledTypography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Welcome back! Log in to continue
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={handleLogin}>
              <StyledTextField
                fullWidth
                label="Username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <GradientButton fullWidth type="submit" variant="contained">
                Sign In
              </GradientButton>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Box component="span" sx={{ color: "#7C3AED", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/signUp")}>
                  Sign Up
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </GradientBackground>
  );
};

export default SignIn;
