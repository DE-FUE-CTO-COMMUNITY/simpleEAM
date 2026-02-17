'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * ArchiMate Business Process Icon
 * Matches the diagram editor library symbol (outlined process arrow shape)
 */
const BusinessProcessIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinejoin="round">
        <path d="M4 8h7V4l9 8-9 8v-4H4z" />
      </g>
    </SvgIcon>
  )
}

export default BusinessProcessIcon
