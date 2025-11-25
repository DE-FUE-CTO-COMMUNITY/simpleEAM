'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { RuntimeConfig, defaultConfig } from './runtime-config.types'

const RuntimeConfigContext = createContext<RuntimeConfig>(defaultConfig)

let configCache: RuntimeConfig | null = null
let configPromise: Promise<RuntimeConfig> | null = null

async function fetchConfig(): Promise<RuntimeConfig> {
  if (configCache) {
    return configCache
  }

  if (configPromise) {
    return configPromise
  }

  configPromise = fetch('/api/runtime-config')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch runtime config')
      }
      return res.json()
    })
    .then((config: RuntimeConfig) => {
      configCache = config
      configPromise = null
      return config
    })
    .catch(error => {
      console.error('Error fetching runtime config:', error)
      configPromise = null
      return defaultConfig
    })

  return configPromise
}

export function RuntimeConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<RuntimeConfig>(configCache || defaultConfig)

  useEffect(() => {
    fetchConfig().then(setConfig)
  }, [])

  return <RuntimeConfigContext.Provider value={config}>{children}</RuntimeConfigContext.Provider>
}

export function useRuntimeConfig(): RuntimeConfig {
  return useContext(RuntimeConfigContext)
}

// Helper hooks for commonly used config values
export function useKeycloakConfig() {
  const config = useRuntimeConfig()
  return config.keycloak
}

export function useGraphQLConfig() {
  const config = useRuntimeConfig()
  return config.graphql
}

export function useExcalidrawConfig() {
  const config = useRuntimeConfig()
  return config.excalidraw
}

export function useThemeConfig() {
  const config = useRuntimeConfig()
  return config.theme
}

export function useLogoConfig() {
  const config = useRuntimeConfig()
  return config.logo
}

export function useToolConfig() {
  const config = useRuntimeConfig()
  return config.tool
}
