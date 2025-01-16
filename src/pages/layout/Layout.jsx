import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import Appbar from '../../pages/appbar/Appbar';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [selectedAlphabet, setSelectedAlphabet] = useState(
    localStorage.getItem('selectedAlphabet') || 'Demographic-History'
  );
  
  // Add state for tracking form completion status
  const [formStatus, setFormStatus] = useState(() => {
    const savedStatus = localStorage.getItem('formCompletionStatus');
    return savedStatus ? JSON.parse(savedStatus) : {
      'Demographic-History': false,
      'Medical-History': false,
      'Smoking-History': false,
      'Systemic-Complications': false,
      'Investigation': false,
      'Ocular-History': false,
      'External-Examination': false,
      'Slit-Lamp-Examination': false,
      'Fundus-Examination': false,
      'DIABETIC-RETINOPATHY': false
    };
  });

  const alphabets = [
    'Demographic-History', 'Medical-History', 'Smoking-History', 
    'Systemic-Complications', 'Investigation', 'Ocular-History', 
    'External-Examination', 'Slit-Lamp-Examination', 'Fundus-Examination', 
    'DIABETIC-RETINOPATHY'
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Save form status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('formCompletionStatus', JSON.stringify(formStatus));
  }, [formStatus]);

  const handleAlphabetClick = (alphabet) => {
    setSelectedAlphabet(alphabet);
    localStorage.setItem('selectedAlphabet', alphabet);
    navigate(`/section-${alphabet}`);
  };

  const handleNextClick = () => {
    const currentIndex = alphabets.indexOf(selectedAlphabet);
    if (currentIndex < alphabets.length - 1) {
      handleAlphabetClick(alphabets[currentIndex + 1]);
    }
  };

  const handlePreviousClick = () => {
    const currentIndex = alphabets.indexOf(selectedAlphabet);
    if (currentIndex > 0) {
      handleAlphabetClick(alphabets[currentIndex - 1]);
    }
  };

  // Method to update form status - will be passed down to children
  const updateFormStatus = (section, isComplete) => {
    setFormStatus(prev => ({
      ...prev,
      [section]: isComplete
    }));
  };

  const getButtonColor = (alphabet) => {
    if (selectedAlphabet === alphabet) {
      return '#1976d2'; // Selected tab remains blue
    }
    if (formStatus[alphabet]) {
      return '#4caf50'; // Completed forms are green
    }
    return '#f44336'; // Incomplete forms are red
  };

  const navigationButtons = alphabets.map((alphabet) => (
    <Button
      key={alphabet}
      variant="outlined"
      size={isLargeScreen ? "medium" : "small"}
      onClick={() => handleAlphabetClick(alphabet)}
      sx={{
        ...(isLargeScreen ? {
          width: '100%',
          justifyContent: 'flex-start',
          padding: '10px 16px',
          marginBottom: '8px',
          textTransform: 'none',
          textAlign: 'left',
          whiteSpace: 'normal',
          lineHeight: 1.3,
        } : {
          flex: '0 0 auto',
          minWidth: 'max-content',
          padding: '6px 12px',
          fontSize: '0.8125rem',
        }),
        backgroundColor: selectedAlphabet === alphabet ? getButtonColor(alphabet) : '#fff',
        color: selectedAlphabet === alphabet ? '#fff' : getButtonColor(alphabet),
        borderColor: getButtonColor(alphabet),
        '&:hover': {
          backgroundColor: selectedAlphabet === alphabet ? getButtonColor(alphabet) : '#f5f5f5',
          borderColor: getButtonColor(alphabet),
        },
      }}
    >
      {alphabet.replace(/-/g, ' ')}
    </Button>
  ));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Appbar setSelectedAlphabet={setSelectedAlphabet} handleAlphabetClick={handleAlphabetClick} />
      
      <Box
        sx={{
          width: '100%',
          mt: { xs: 7, sm: 8, md: 9 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            mb: { xs: 2, sm: 3 },
            color: '#1976d2',
            fontWeight: 600,
            ml:{xs:2,sm:5},
            mt:{xs:1,sm:5}
          }}
        >
          DIABETIC RETINOPATHY REGISTRY IN NEPAL
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {isLargeScreen ? (
            <Box
              sx={{
                width: '250px',
                flexShrink: 0,
                pr: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {navigationButtons}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                pb: 1,
                overflowX: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                '-webkit-overflow-scrolling': 'touch',
              }}
            >
              {navigationButtons}
            </Box>
          )}

          <Box
            sx={{
              flexGrow: 1,
              width: { xs: '100%', md: 'calc(100% - 250px)' },
              maxWidth: '100%',
              overflowX: 'hidden',
            }}
          >
            {React.cloneElement(children, {
              selectedAlphabet,
              setSelectedAlphabet,
              handleNextClick,
              handlePreviousClick,
              updateFormStatus, // Pass down the method to update form status
              formStatus // Pass down current form status
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;