import React, { useState, useCallback } from 'react';
import { InputBase, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debouncing: Delays the search function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((query) => {
      if (onSearch) onSearch(query);
    }, 500),
    [onSearch]
  );

  // Handle input changes
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: '#f0f0f0',
        borderRadius: '8px',
        padding: '0 10px',
        width: { xs: '100%', sm: '300px' },
        maxWidth: '400px',
      }}
    >
      <InputBase
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        sx={{
          flex: 1,
          padding: '5px 10px',
        }}
      />
      <IconButton>
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
