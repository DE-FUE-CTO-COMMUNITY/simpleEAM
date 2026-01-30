'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createDynamicTheme } from '@/theme/dynamic-theme'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useThemeConfig } from '@/lib/runtime-config'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  theme: Theme
  toggleTheme: () => void
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize with light mode as default
  const [mode, setMode] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)
  const { selectedCompany } = useCompanyContext()
  const themeConfig = useThemeConfig()

  const brandingOverrides = useMemo(() => {
    if (!selectedCompany) return undefined
    return {
      primaryColor: selectedCompany.primaryColor || undefined,
      secondaryColor: selectedCompany.secondaryColor || undefined,
      fontFamily: selectedCompany.font || undefined,
    }
  }, [selectedCompany])

  // Create theme based on current mode
  const theme = useMemo(
    () => createDynamicTheme(mode, brandingOverrides, themeConfig),
    [mode, brandingOverrides, themeConfig]
  )

  // LocalStorage integration with hydration protection
  useEffect(() => {
    setMounted(true)

    // Load saved theme preference from localStorage
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode)
    } else {
      // If no preference is saved, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialMode = prefersDark ? 'dark' : 'light'
      setMode(initialMode)
      localStorage.setItem('theme-mode', initialMode)
    }
  }, [])

  // Save mode changes to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', mode)
    }
  }, [mode, mounted])

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  // Avoid hydration errors through delayed rendering
  if (!mounted) {
    // During server-side rendering or before client hydration
    // use a default theme
    return (
      <ThemeContext.Provider
        value={{
          mode: 'light',
          theme: createDynamicTheme('light', brandingOverrides, themeConfig),
          toggleTheme: () => {},
          setThemeMode: () => {},
        }}
      >
        <MuiThemeProvider theme={createDynamicTheme('light', brandingOverrides, themeConfig)}>
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        toggleTheme,
        setThemeMode,
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
