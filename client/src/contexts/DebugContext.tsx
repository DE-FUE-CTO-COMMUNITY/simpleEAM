'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DebugSettings {
  showElementCoordinates: boolean
  showArrowDebugInfo: boolean
  showPerformanceMetrics: boolean
  showDiagramSaveLogs: boolean
}

interface DebugContextType {
  settings: DebugSettings
  updateSetting: (key: keyof DebugSettings, value: boolean) => void
  resetSettings: () => void
}

const defaultSettings: DebugSettings = {
  showElementCoordinates: false,
  showArrowDebugInfo: false,
  showPerformanceMetrics: false,
  showDiagramSaveLogs: false,
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DebugSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('debug-settings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.warn('Failed to parse debug settings from localStorage:', error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('debug-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key: keyof DebugSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <DebugContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </DebugContext.Provider>
  )
}

export function useDebug() {
  const context = useContext(DebugContext)
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider')
  }
  return context
}
