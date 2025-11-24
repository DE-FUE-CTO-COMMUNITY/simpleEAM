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
}

export const defaultConfig: RuntimeConfig = {
  keycloak: {
    url: 'https://auth.dev-server.mf2.eu',
    realm: 'simple-eam',
    clientId: 'eam-client',
  },
  graphql: {
    url: 'https://api.dev-server.mf2.eu/graphql',
  },
  excalidraw: {
    wsServerUrl: 'https://room.dev-server.mf2.eu',
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
}
