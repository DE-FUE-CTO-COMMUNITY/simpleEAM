import { NextResponse } from 'next/server'
import type { RuntimeConfig } from '@/lib/runtime-config'

/**
 * API endpoint to provide runtime configuration to the client
 * This reads from environment variables at runtime, not build time
 */
export async function GET() {
  const config: RuntimeConfig = {
    graphqlUrl: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql',
    keycloak: {
      url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.KEYCLOAK_REALM || 'simple-eam',
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'eam-client',
    },
    theme: {
      primaryColor: process.env.THEME_PRIMARY_COLOR,
      secondaryColor: process.env.THEME_SECONDARY_COLOR,
      fontFamily: process.env.THEME_FONT_FAMILY,
    },
    features: {
      debugMode: process.env.DEBUG_MODE === 'true',
    },
  }

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Content-Type': 'application/json',
    },
  })
}
