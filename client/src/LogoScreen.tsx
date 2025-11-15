import React from 'react';
import { Box } from '@mui/material';

interface LogoScreenProps {
}

const LogoScreen: React.FC<LogoScreenProps> = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/logoHD.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
    </Box>
  );
};

export default LogoScreen;
