import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">Page Not Found</Typography>
    </Box>
  );
};

export default NotFound;
