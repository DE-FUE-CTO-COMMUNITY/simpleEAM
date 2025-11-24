import { NextRequest, NextResponse } from 'next/server'

export interface AuthResult {
  isAuthenticated: boolean
  isAdmin: boolean
  user?: {
    id: string
    username: string
    email: string
    roles: string[]
  }
  error?: string
}

/**
 * Überprüft die Authentifizierung und Autorisierung eines Requests
 * @param request - Der eingehende Request
 * @param requireAdmin - Ob Admin-Berechtigung erforderlich ist (default: false)
 * @returns AuthResult mit Authentifizierungsstatus und Benutzerinformationen
 */
export async function validateAuth(
  request: NextRequest,
  requireAdmin: boolean = false
): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: 'Authorization header missing or invalid',
      }
    }

    const token = authHeader.substring(7)

    // Validate token via Keycloak User Info Endpoint (easier for public clients)
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080'
    const realm = process.env.KEYCLOAK_REALM || 'simple-eam'

    // Use User Info Endpoint (automatically validates token)
    const userInfoResponse = await fetch(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!userInfoResponse.ok) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: `Token validation failed: ${userInfoResponse.status} ${userInfoResponse.statusText}`,
      }
    }

    const userInfo = await userInfoResponse.json()

    // Token payload dekodieren für Rolleninformationen
    let tokenPayload: any
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]))
    } catch (authError) {
      console.error('❌ Token-Dekodierung fehlgeschlagen:', authError)
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: authError instanceof Error ? authError.message : 'Invalid token format',
      }
    }

    // Client ID für Rollen-Extraktion
    const clientId = process.env.KEYCLOAK_CLIENT_ID_CLIENT || 'eam-client'

    // Extract roles from token
    const realmAccess = tokenPayload.realm_access?.roles || []
    const resourceAccess = tokenPayload.resource_access?.[clientId]?.roles || []
    const allRoles = [...realmAccess, ...resourceAccess]

    const isAdmin = allRoles.includes('admin')

    // If admin permission required but not present
    if (requireAdmin && !isAdmin) {
      console.error('❌ Admin-Berechtigung erforderlich, aber nicht vorhanden')
      return {
        isAuthenticated: true,
        isAdmin: false,
        error: 'Admin privileges required',
      }
    }

    return {
      isAuthenticated: true,
      isAdmin,
      user: {
        id: tokenPayload.sub || userInfo.sub,
        username: tokenPayload.preferred_username || userInfo.preferred_username,
        email: tokenPayload.email || userInfo.email,
        roles: allRoles,
      },
    }
  } catch (error) {
    console.error('❌ Authentifizierung fehlgeschlagen:', error)
    return {
      isAuthenticated: false,
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    }
  }
}

/**
 * Higher-Order Function für API-Routen mit Authentifizierung
 * @param handler - Der API-Handler
 * @param requireAdmin - Ob Admin-Berechtigung erforderlich ist
 * @returns Wrapper-Handler mit Authentifizierung
 */
export function withAuth(
  handler: (request: NextRequest, authResult: AuthResult) => Promise<NextResponse>,
  requireAdmin: boolean = false
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await validateAuth(request, requireAdmin)

    if (!authResult.isAuthenticated) {
      console.error('❌ Authentifizierung fehlgeschlagen:', authResult.error)
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    if (requireAdmin && !authResult.isAdmin) {
      console.error('❌ Admin-Berechtigung erforderlich')
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }

    return handler(request, authResult)
  }
}
