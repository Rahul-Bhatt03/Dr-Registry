import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const ProfileIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    dispatch(logout());
    navigate("/");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    handleClose();
  };

  return (
    <Box>
      <IconButton
        edge="end"
        onClick={handleClick}
        sx={{
          padding: 1,
          border: "3px solid transparent",
          transition: "all 0.3s ease-in-out",
          background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
          "&:hover": {
            border: "3px solid rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
            transform: "scale(1.05)",
          },
        }}
      >
        {selectedImage ? (
          <Box
            component="img"
            src={selectedImage}
            alt="Profile"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
            }}
          />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 40, color: "white" }} />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            maxHeight: 300,
            width: "250px",
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.2)",
            background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#8b5cf6",
              borderRadius: "4px",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleClose();
          }}
          sx={menuItemStyle}
        >
          <ListItemIconStyled>
            <PersonIcon sx={{ color: "#6366f1" }} />
          </ListItemIconStyled>
          <MenuText>Profile</MenuText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/dashboard");
            handleClose();
          }}
          sx={menuItemStyle}
        >
          <ListItemIconStyled>
            <DashboardIcon sx={{ color: "#8b5cf6" }} />
          </ListItemIconStyled>
          <MenuText>Dashboard</MenuText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/adminsGroup");
            handleClose();
          }}
          sx={menuItemStyle}
        >
          <ListItemIconStyled>
            <AdminPanelSettingsIcon sx={{ color: "#6366f1" }} />
          </ListItemIconStyled>
          <MenuText>add-admins</MenuText>
        </MenuItem>

        <MenuItem component="label" sx={menuItemStyle}>
          <ListItemIconStyled>
            <UploadFileIcon sx={{ color: "#8b5cf6" }} />
          </ListItemIconStyled>
          <MenuText>Upload Picture</MenuText>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            ...menuItemStyle,
            color: "#ef4444",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          <ListItemIconStyled>
            <LogoutIcon sx={{ color: "#ef4444" }} />
          </ListItemIconStyled>
          <MenuText>Logout</MenuText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Styled Components
const ListItemIconStyled = ({ children }) => (
  <Box
    sx={{
      minWidth: 40,
      display: "flex",
      justifyContent: "center",
    }}
  >
    {children}
  </Box>
);

const MenuText = ({ children }) => (
  <Typography
    sx={{
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: "0.9375rem",
    }}
  >
    {children}
  </Typography>
);

// Shared Styles
const menuItemStyle = {
  py: 1.5,
  px: 2,
  borderRadius: 1,
  mx: 1,
  my: 0.5,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    transform: "translateX(4px)",
  },
};

export default ProfileIcon;
