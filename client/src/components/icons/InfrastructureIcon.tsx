import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * InfrastructureIcon - 3D Würfel basierend auf ArchiMate Node Symbol
 * Isometrische Darstellung eines dreidimensionalen Würfels
 */
const InfrastructureIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Vordere Fläche des Würfels */}
      <path
        d="M5 10 L5 20 L15 20 L15 10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Obere Fläche des Würfels (isometrisch) */}
      <path
        d="M5 10 L8 7 L18 7 L15 10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Rechte Seitenfläche des Würfels */}
      <path
        d="M15 10 L18 7 L18 17 L15 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Verstärkung der sichtbaren Kanten für 3D-Effekt */}
      <path d="M5 10 L8 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M15 10 L18 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M15 20 L18 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </SvgIcon>
  )
}

export default InfrastructureIcon
