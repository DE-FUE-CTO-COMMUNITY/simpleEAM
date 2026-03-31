export interface RuntimeConfig {
  brand: {
    nameLong: string
    nameShort: string
  }
  keycloak: {
    url: string
    realm: string
    clientId: string
  }
  graphql: {
    url: string
  }
  ai: {
    apiUrl: string
    llmUrl: string
  }
  excalidraw: {
    wsServerUrl: string
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  logo: {
    url: string
    alt: string
    width: number
    darkUrl: string
  }
  ui: {
    drawerWidth: number
  }
  favicon: {
    url: string
  }
  tool: {
    version: string
  }
}

export const defaultConfig: RuntimeConfig = {
  brand: {
    nameLong: 'NextGen Enterprise Architecture Management',
    nameShort: 'NextGen EAM',
  },
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'nextgen-eam',
    clientId: 'eam-client',
  },
  graphql: {
    url: 'http://localhost:4000/graphql',
  },
  ai: {
    apiUrl: '',
    llmUrl: '',
  },
  excalidraw: {
    wsServerUrl: 'http://localhost:3002',
  },
  theme: {
    primaryColor: '#00BCD4',
    secondaryColor: '#4E342E',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  logo: {
    url: '/images/NextGen-EAM-Logo.svg',
    alt: 'NextGen EAM Logo',
    width: 120,
    darkUrl: '',
  },
  ui: {
    drawerWidth: 240,
  },
  favicon: {
    url: '/favicon.ico',
  },
  tool: {
    version: '0.0.0',
  },
}
