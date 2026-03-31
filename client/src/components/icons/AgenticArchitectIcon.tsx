'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * Agentic Architect Icon
 * Combines a person silhouette (from PersonIcon) with an AI sparkle (from AIComponentIcon),
 * representing an AI-powered architect role.
 */
const AgenticArchitectIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Person silhouette - scaled down and shifted left to leave room for sparkle */}
      <g transform="translate(-2, 2) scale(0.82)">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </g>
      {/* AI sparkle - large 4-pointed star, top right */}
      <path d="M19.5 0.5 L20.6 3.9 L24 5 L20.6 6.1 L19.5 9.5 L18.4 6.1 L15 5 L18.4 3.9 Z" />
    </SvgIcon>
  )
}

export default AgenticArchitectIcon
