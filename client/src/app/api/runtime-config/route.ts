import { NextResponse } from 'next/server'
import packageJson from '../../../../package.json'

const appVersion = packageJson.version ?? '0.0.0'

/**
 * Runtime configuration endpoint
 * Exposes server-side environment variables to the client at runtime
 * This replaces NEXT_PUBLIC_* build-time variables
 */
export async function GET() {
  const config = {
    // Keycloak Configuration
    keycloak: {
      url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.KEYCLOAK_REALM || 'simple-eam',
      clientId: process.env.KEYCLOAK_CLIENT_ID_CLIENT || 'eam-client',
    },

    // GraphQL API
    graphql: {
      url: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql',
    },

    // Excalidraw Collaboration
    excalidraw: {
      wsServerUrl: process.env.EXCALIDRAW_WS_SERVER_URL || 'http://localhost:3002',
    },

    // Theme Configuration
    theme: {
      primaryColor: process.env.THEME_PRIMARY_COLOR || '#00BCD4',
      secondaryColor: process.env.THEME_SECONDARY_COLOR || '#4E342E',
      fontFamily: process.env.THEME_FONT_FAMILY || '"Roboto", "Helvetica", "Arial", sans-serif',
    },

    // Logo Configuration
    logo: {
      url: process.env.LOGO_URL || '/images/Simple-EAM-Logo.svg',
      alt: process.env.LOGO_ALT || 'Simple-EAM Logo',
    },

    // Tool metadata
    tool: {
      version: appVersion,
    },
  }

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
