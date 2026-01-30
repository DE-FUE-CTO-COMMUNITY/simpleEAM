export interface RuntimeConfig {
  keycloak: {
    url: string
    realm: string
    clientId: string
  }
  graphql: {
    url: string
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
  }
  tool: {
    version: string
  }
}

export const defaultConfig: RuntimeConfig = {
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'simple-eam',
    clientId: 'eam-client',
  },
  graphql: {
    url: 'http://localhost:4000/graphql',
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
    url: '/images/Simple-EAM-Logo.svg',
    alt: 'Simple-EAM Logo',
  },
  tool: {
    version: '0.0.0',
  },
}
