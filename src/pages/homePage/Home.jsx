import React, { useState } from 'react'
import HeroSection from './HeroSection'
import Appbar from '../appbar/Appbar'
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();
  const [selectedAlphabet, setSelectedAlphabet] = useState(
    localStorage.getItem('selectedAlphabet') || 'Demographic-History'
  );

  const handleAlphabetClick = (alphabet) => {
    // Directly set the state and navigate without checking the previous value
    setSelectedAlphabet(alphabet);
    localStorage.setItem('selectedAlphabet', alphabet);
    navigate(`/section-${alphabet}`);
  };
  

  return (
    <div>
      <Appbar setSelectedAlphabet={setSelectedAlphabet} handleAlphabetClick={handleAlphabetClick} />
      <HeroSection/>
    </div>
  )
}

export default Home
