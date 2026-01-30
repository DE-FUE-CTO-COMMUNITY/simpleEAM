'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * ArchiMate Application Interface Icon
 * Represents an interface between application components
 */
const ApplicationInterfaceIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Official ArchiMate Interface Icon based on InterfaceFigure.java */}
      <g stroke="currentColor" strokeWidth="1" fill="none">
        {/* Circle (main interface symbol) */}
        <circle cx="15" cy="12" r="5" />
        
        {/* Horizontal line extending left */}
        <line x1="10" y1="12" x2="3" y2="12" />
      </g>
    </SvgIcon>
  )
}

export default ApplicationInterfaceIcon
