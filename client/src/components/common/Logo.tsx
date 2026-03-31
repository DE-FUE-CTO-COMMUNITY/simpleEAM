import React from 'react'
import Image from 'next/image'
import { Box, BoxProps } from '@mui/material'
import { useLogoConfig } from '@/lib/runtime-config'
import { useThemeMode } from '@/contexts/ThemeContext'

interface LogoProps extends BoxProps {
  variant?: 'blue' | 'white'
}

const LOGO_HEIGHT = 30
const LOGO_MAX_WIDTH = 184

/**
 * Logo Komponente für die Verwendung im Header und Footer
 * Das Logo wird dynamically from runtime configuration geladen
 */
const Logo: React.FC<LogoProps> = ({ ...boxProps }) => {
  const logoConfig = useLogoConfig()
  const { mode } = useThemeMode()

  const logoName = logoConfig.alt || 'NextGen EAM'
  const logoWidth = Math.min(logoConfig.width || 120, LOGO_MAX_WIDTH)
  const logoPath =
    mode === 'dark' && logoConfig.darkUrl
      ? logoConfig.darkUrl
      : logoConfig.url || '/images/NextGen-EAM-Logo.png'

  return (
    <Box {...boxProps} sx={{ display: 'inline-flex', alignItems: 'center', ...boxProps.sx }}>
      <Box
        sx={{
          position: 'relative',
          height: LOGO_HEIGHT,
          width: logoWidth,
          flexShrink: 0,
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
          sizes={`${logoWidth}px`}
          priority
        />
      </Box>
    </Box>
  )
}

export default Logo
