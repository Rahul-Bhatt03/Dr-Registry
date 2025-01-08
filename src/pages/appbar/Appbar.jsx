import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice.js';
import ProfileIcon from '../appbar/ProfileIcon';
import SearchBar from '../appbar/SearchBar';
import logo from '../../assets/logo.webp';

function Appbar({ setSelectedAlphabet, handleAlphabetClick }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleNavigation = (path, alphabet) => {
    console.log("Navigating to:", path);  // Debugging to see the path
    navigate(path);  // Navigates to the given path
    setDrawerOpen(false);
    if (alphabet) {
      handleAlphabetClick(alphabet);  // Update the alphabet color when navigating
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    dispatch(logout());
    navigate('/signin');
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'HOME', icon: <HomeIcon />, path: '/home' },
    { text: 'Register Patient', icon: <InfoIcon />, path: '/section-Demographic-History', alphabet: 'Demographic-History' },
    { text: 'HISTORY', icon: <HistoryIcon />, path: '/individualHistory' },  // Correct path for History
  ];

  const renderMenuItems = (isMobileView = false) => (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          onClick={() => handleNavigation(item.path, item.alphabet)}
          sx={{
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
            },
            cursor: 'pointer',
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #3494E6, #EC6EAD, #6D5BAF)',
          width: '100vw',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{
              mr: 2,
              display: { xs: 'block', md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton onClick={handleLogoClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                height: '40px',
                cursor: 'pointer',
                borderRadius: '50%',
              }}
            />
          </IconButton>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: '10px',
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => handleNavigation(item.path, item.alphabet)}
                sx={{ fontWeight: 'bold', textTransform: 'none' }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SearchBar onSearch={(query) => navigate(`/search?q=${query}`)} />
            {localStorage.getItem('roles') && localStorage.getItem('token') ? (
              <ProfileIcon />
            ) : (
              <Button onClick={() => navigate('/signin')} color="inherit">
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            background: 'linear-gradient(135deg, #3494E6, #EC6EAD)',
            color: 'white',
          },
        }}
      >
        <Box onClick={toggleDrawer(false)}>{renderMenuItems(true)}</Box>
      </Drawer>
    </Box>
  );
}

export default Appbar;
