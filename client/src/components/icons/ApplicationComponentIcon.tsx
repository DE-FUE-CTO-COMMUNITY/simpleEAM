'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * ArchiMate Application Component Icon
 * Represents an application component in the application layer
 */
const ApplicationComponentIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Official ArchiMate Application Component Icon based on ApplicationComponentFigure.java */}
      <g stroke="currentColor" strokeWidth="1" fill="none">
        {/* Main vertical line segments (left side) */}
        <line x1="8" y1="20" x2="8" y2="16" />
        <line x1="8" y1="14" x2="8" y2="12" />
        <line x1="8" y1="9" x2="8" y2="7" />
        
        {/* Horizontal line connecting to right side */}
        <line x1="8" y1="7" x2="18" y2="7" />
        
        {/* Vertical line down on right side */}
        <line x1="18" y1="7" x2="18" y2="20" />
        
        {/* Bottom horizontal line */}
        <line x1="8" y1="20" x2="18" y2="20" />
        
        {/* Two horizontal rectangles (component symbols) */}
        <rect x="5" y="9" width="6" height="2.5" />
        <rect x="5" y="14" width="6" height="2.5" />
      </g>
    </SvgIcon>
  )
}

export default ApplicationComponentIcon
