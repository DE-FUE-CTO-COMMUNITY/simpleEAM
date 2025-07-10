'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createDynamicTheme } from '@/theme/dynamic-theme'

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
  // Initialisiere mit light mode als Standard
  const [mode, setMode] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)

  // Theme basierend auf dem aktuellen Mode erstellen
  const theme = createDynamicTheme(mode)

  // LocalStorage Integration mit Hydration-Schutz
  useEffect(() => {
    setMounted(true)
    
    // Lade gespeicherte Theme-Präferenz aus localStorage
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode)
    } else {
      // Falls keine Präferenz gespeichert ist, prüfe System-Präferenz
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialMode = prefersDark ? 'dark' : 'light'
      setMode(initialMode)
      localStorage.setItem('theme-mode', initialMode)
    }
  }, [])

  // Speichere Mode-Änderungen in localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', mode)
    }
  }, [mode, mounted])

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  // Vermeide Hydration-Fehler durch verzögertes Rendern
  if (!mounted) {
    // Während Server-Side Rendering oder vor Client-Hydration
    // verwende ein Standard-Theme
    return (
      <ThemeContext.Provider
        value={{
          mode: 'light',
          theme: createDynamicTheme('light'),
          toggleTheme: () => {},
          setThemeMode: () => {},
        }}
      >
        <MuiThemeProvider theme={createDynamicTheme('light')}>
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
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
