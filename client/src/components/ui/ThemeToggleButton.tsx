'use client'

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useThemeMode } from '@/contexts/ThemeContext'

interface ThemeToggleButtonProps {
  /**
   * Optional custom styling
   */
  sx?: object
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ sx }) => {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Tooltip
      title={mode === 'light' ? 'Zu dark mode wechseln' : 'Zu Light Mode wechseln'}
      placement="bottom"
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          ...sx,
        }}
        aria-label={`Zu ${mode === 'light' ? 'Dark' : 'Light'} Mode wechseln`}
      >
        {mode === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggleButton
