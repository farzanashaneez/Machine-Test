// src/components/ErrorPage.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

const ErrorPage = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" color="error">
        Oops! The page you are looking for doesn't exist.
      </Typography>
    </Box>
  );
};

export default ErrorPage;
