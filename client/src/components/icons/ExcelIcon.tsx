import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

const ExcelIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Excel-ähnliches Icon mit Tabellen-Design */}
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      <path d="M8,12H16V13H8V12M8,14H16V15H8V14M8,16H13V17H8V16Z" />
    </SvgIcon>
  )
}

export default ExcelIcon
