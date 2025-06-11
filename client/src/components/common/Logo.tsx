import React from 'react'
import Image from 'next/image'
import { Box, BoxProps } from '@mui/material'

interface LogoProps extends BoxProps {
  variant?: 'blue' | 'white'
  height?: number
}

/**
 * Logo Komponente für die Verwendung im Header und Footer
 * Das Logo wird dynamisch aus Umgebungsvariablen geladen
 */
const Logo: React.FC<LogoProps> = ({ height = 40, ...boxProps }) => {
  // Logo-Pfad aus Umgebungsvariablen laden, mit Fallback auf Simple-EAM Logo
  // Unterstütze sowohl die alten (_URL/_ALT) als auch die neuen (_PATH/_NAME) Variablennamen
  const logoPath =
    process.env.NEXT_PUBLIC_LOGO_PATH ||
    process.env.NEXT_PUBLIC_LOGO_URL ||
    '/images/Simple-EAM-Logo.png'
  const logoName =
    process.env.NEXT_PUBLIC_LOGO_NAME || process.env.NEXT_PUBLIC_LOGO_ALT || 'Simple-EAM'

  // Debug: Umgebungsvariablen ausgeben
  console.log('🔍 Logo Debug Information:')
  console.log('NEXT_PUBLIC_LOGO_PATH:', process.env.NEXT_PUBLIC_LOGO_PATH)
  console.log('NEXT_PUBLIC_LOGO_NAME:', process.env.NEXT_PUBLIC_LOGO_NAME)
  console.log('NEXT_PUBLIC_LOGO_URL:', process.env.NEXT_PUBLIC_LOGO_URL)
  console.log('NEXT_PUBLIC_LOGO_ALT:', process.env.NEXT_PUBLIC_LOGO_ALT)
  console.log('Resolved logoPath:', logoPath)
  console.log('Resolved logoName:', logoName)
  console.log(
    'All NEXT_PUBLIC env vars:',
    Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  )

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
          onLoad={() => console.log('✅ Logo erfolgreich geladen:', logoPath)}
          onError={e => console.error('❌ Logo konnte nicht geladen werden:', logoPath, e)}
        />
      </Box>
    </Box>
  )
}

export default Logo
