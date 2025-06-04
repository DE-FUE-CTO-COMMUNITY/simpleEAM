'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * ArchiMate Business Object Icon
 * Represents a passive business element that contains business information
 */
const BusinessObjectIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Official ArchiMate Business Object Icon based on ObjectFigure.java */}
      <g stroke="currentColor" strokeWidth="1" fill="none">
        {/* Main rectangle */}
        <rect x="6" y="8" width="13" height="10" />
        
        {/* Horizontal divider line */}
        <line x1="6" y1="11" x2="19" y2="11" />
      </g>
    </SvgIcon>
  )
}

export default BusinessObjectIcon
