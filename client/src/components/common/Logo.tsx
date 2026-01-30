import React from 'react'
import Image from 'next/image'
import { Box, BoxProps } from '@mui/material'
import { useLogoConfig } from '@/lib/runtime-config'

interface LogoProps extends BoxProps {
  variant?: 'blue' | 'white'
  height?: number
}

/**
 * Logo Komponente für die Verwendung im Header und Footer
 * Das Logo wird dynamically from runtime configuration geladen
 */
const Logo: React.FC<LogoProps> = ({ height = 40, ...boxProps }) => {
  // Logo configuration from runtime config
  const logoConfig = useLogoConfig()

  const logoPath = logoConfig.url || '/images/Simple-EAM-Logo.png'
  const logoName = logoConfig.alt || 'Simple-EAM'

  return (
    <Box {...boxProps} sx={{ display: 'inline-flex', alignItems: 'center', ...boxProps.sx }}>
      <Box
        sx={{
          position: 'relative',
          height: height,
          aspectRatio: '2.5/1',
          minWidth: `${height * 2.5}px`,
        }}
      >
        <Image
          src={logoPath}
          alt={`${logoName} Logo`}
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
          sizes={`${height * 2.5}px`}
          priority
        />
      </Box>
    </Box>
  )
}

export default Logo
