import React from 'react';
import Image from 'next/image';
import { Box, BoxProps } from '@mui/material';

interface AtosLogoProps extends BoxProps {
  variant?: 'blue' | 'white';
  height?: number;
}

/**
 * AtosLogo Komponente für die Verwendung im Header und Footer
 */
const AtosLogo: React.FC<AtosLogoProps> = ({ variant = 'blue', height = 40, ...boxProps }) => {
  const logoSrc =
    variant === 'blue'
      ? '/images/New Atos logo/Blue/New Atos logo blue RGB/New Atos logo blue RGB.svg'
      : '/images/New Atos logo/White/New Atos logo white.svg';

  return (
    <Box {...boxProps} sx={{ display: 'inline-flex', alignItems: 'center', ...boxProps.sx }}>
      <Image src={logoSrc} alt="Atos Logo" width={height * 2.5} height={height} priority />
    </Box>
  );
};

export default AtosLogo;
