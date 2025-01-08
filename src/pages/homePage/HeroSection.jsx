import React from 'react';
import { Box, Typography, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import videoSrc from '../../assets/hero.mp4';

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Media query helpers for different device sizes
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const handleBrowseClick = () => {
    navigate('/section-Demographic-History');
  };

  const getResponsiveStyles = () => {
    return {
      container: {
        width: '100vw', // Full viewport width
        height: '100vh', // Full viewport height for mobile
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      },
      textContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: isXs ? 'center' : 'flex-start',
        color: 'white',
        zIndex: 2,
        position: 'absolute',
        left: isXs ? '50%' : '5%',
        top: '50%',
        transform: isXs ? 'translate(-50%, -50%)' : 'translateY(-50%)',
        width: isXs ? '90%' : '50%',
        padding: '0 20px',
      },
      mainTitle: {
        color: 'black',
        fontSize: isXs ? '1.5rem' : isSm ? '2rem' : isMd ? '2.5rem' : '3.5rem',
        fontWeight: '700',
        marginBottom: '15px',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
        lineHeight: '1.2',
        textAlign: isXs ? 'center' : 'left',
      },
      subTitle: {
        fontSize: isXs ? '1rem' : isSm ? '1.2rem' : isMd ? '1.5rem' : '1.5rem',
        marginBottom: '25px',
        fontStyle: 'italic',
        fontWeight: '400',
        opacity: 0.8,
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
        lineHeight: '1.5',
        color: 'black',
        textAlign: isXs ? 'center' : 'left',
      },
      videoContainer: {
        position: 'absolute',
        width: '100%',
        height: isXs ? '100%' : '100%', // Full height on mobile, 60% on larger screens
        zIndex: 1,
        margin: 0,
        padding: 0,
      },
      videoStyle: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
        transition: 'all 0.5s ease',
      },
      ctaButton: {
        fontSize: isXs ? '0.9rem' : '1.1rem',
        fontWeight: 'bold',
        padding: isXs ? '10px 20px' : '15px 30px',
        borderRadius: '30px',
        border: '2px solid #007BFF',
        color: '#007BFF',
        '&:hover': {
          backgroundColor: '#007BFF',
          color: 'purple',
          borderColor: '#005666',
        },
      }
    };
  };

  const styles = getResponsiveStyles();

  return (
    <Grid 
      container 
      sx={styles.container}
    >
      {/* Text Content */}
      <Grid 
        item 
        sx={styles.textContainer}
      >
        <Typography variant="h2" sx={styles.mainTitle}>
DIABETIC RETINOPATHY        </Typography>
        <Typography variant="h5"           color="primary"
 sx={styles.subTitle}>
PREVENTION IS BETTER THAN CURE        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={handleBrowseClick}
          sx={styles.ctaButton}
        >
      Register Patient 
        </Button>
      </Grid>

      {/* Video Background */}
      <Grid 
        item 
        sx={styles.videoContainer}
      >
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          style={styles.videoStyle}
        />
      </Grid>
    </Grid>
  );
};

export default HeroSection;
