import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Appbar from '../../pages/appbar/Appbar';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [selectedAlphabet, setSelectedAlphabet] = useState(
    localStorage.getItem('selectedAlphabet') || 'Demographi-History'
  );

  const alphabets = ['Demographic-History', 'Medical-History', 'Smoking-History', 'Systemic-Complications', 'Investigation', 'Ocular-History', 'External-Examination', 'Slit-Lamp-Examination', 'Fundus-Examination', 'DIABETIC-RETINOPATHY'];

  const handleAlphabetClick = (alphabet) => {
    // Directly set the state and navigate without checking the previous value
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

    // // Scroll to top on location change
    // useEffect(() => {
    //   window.scrollTo(0, 0);
    // }, [location]);

  return (
    <>
      <Appbar setSelectedAlphabet={setSelectedAlphabet} handleAlphabetClick={handleAlphabetClick} />
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          mt: { xs: 9, md: 13 },
          px: 2,
        }}
      >
         <Typography variant="h4" component="h1" gutterBottom textAlign={'center'}>
            DIABETIC RETINOPATHY REGISTRY IN NEPAL
          </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            marginBottom: 3,
            padding: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#aaa',
            },
          }}
        >
          {['Demographic-History', 'Medical-History', 'Smoking-History', 'Systemic-Complications', 'Investigation', 'Ocular-History', 'External-Examination', 'Slit-Lamp-Examination', 'Fundus-Examination', 'DIABETIC-RETINOPATHY'].map((alphabet) => (
            <Button
              key={alphabet}
              variant="outlined"
              size="small"
              onClick={() => handleAlphabetClick(alphabet)}
              sx={{
                flex: '1 0 auto',
                minWidth: '40px',
                padding: '5px',
                backgroundColor: selectedAlphabet === alphabet ? '#1976d2' : '#fff',
                color: selectedAlphabet === alphabet ? '#fff' : '#000',
                borderColor: selectedAlphabet === alphabet ? '#1976d2' : '#ccc',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: selectedAlphabet === alphabet ? '#1565c0' : '#f5f5f5',
                },
              }}
            >
              {alphabet.toUpperCase()}
            </Button>
          ))}
        </Box>
        {React.cloneElement(children, { 
          selectedAlphabet, 
          setSelectedAlphabet, 
          handleNextClick, 
          handlePreviousClick 
        })}
      </Box>
    </>
  );
};

export default Layout;
