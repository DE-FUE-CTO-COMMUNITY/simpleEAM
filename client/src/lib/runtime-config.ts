/**
 * Runtime Configuration for Simple EAM Client
 * This configuration is loaded at runtime and can be changed without rebuilding
 */

export interface RuntimeConfig {
  graphqlUrl: string
  keycloak: {
    url: string
    realm: string
    clientId: string
  }
  theme: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  features: {
    debugMode?: boolean
  }
}

let cachedConfig: RuntimeConfig | null = null

/**
 * Loads runtime configuration from the server
 * This allows configuration changes without rebuilding the client
 */
export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const existingConfig = cachedConfig
  if (existingConfig) {
    return existingConfig
  }

  try {
    const response = await fetch('/api/config')
    if (response.ok) {
      cachedConfig = (await response.json()) as RuntimeConfig
      return cachedConfig
    }
  } catch (error) {
    console.warn('Failed to load runtime config, using defaults:', error)
  }

  // Fallback to default configuration
  cachedConfig = getDefaultConfig()
  return cachedConfig
}

/**
 * Returns the default configuration
 */
export function getDefaultConfig(): RuntimeConfig {
  return {
    graphqlUrl: 'http://localhost:4000/graphql',
    keycloak: {
      url: 'http://localhost:8080',
      realm: 'simple-eam',
      clientId: 'eam-client',
    },
    theme: {
      primaryColor: '#0066CC',
      secondaryColor: '#00AEEF',
      fontFamily: 'Roboto, sans-serif',
    },
    features: {
      debugMode: false,
    },
  }
}

/**
 * Gets the current runtime configuration
 * Returns cached config or default if not loaded yet
 */
export function getRuntimeConfig(): RuntimeConfig {
  return cachedConfig || getDefaultConfig()
}

/**
 * Clears the cached configuration (useful for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null
}
