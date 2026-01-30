'use client'

import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

/**
 * Official ArchiMate Business Capability Icon
 * Represents a business capability with the official 6-square pattern:
 * Top row: 1 square (right-aligned)
 * Middle row: 2 squares 
 * Bottom row: 3 squares
 */
const BusinessCapabilityIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Official ArchiMate Business Capability internal symbol - 6 squares in 1-2-3 pattern */}
      
      {/* Top row - 1 square (right-aligned) */}
      <rect 
        x="16" 
        y="6" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      
      {/* Middle row - 2 squares */}
      <rect 
        x="12" 
        y="10" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      <rect 
        x="16" 
        y="10" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      
      {/* Bottom row - 3 squares */}
      <rect 
        x="8" 
        y="14" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      <rect 
        x="12" 
        y="14" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      <rect 
        x="16" 
        y="14" 
        width="4" 
        height="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
    </SvgIcon>
  )
}

export default BusinessCapabilityIcon
