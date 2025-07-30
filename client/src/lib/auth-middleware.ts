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
    console.log('🔒 Validiere Authentifizierung...', { requireAdmin })
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization header fehlt oder ungültig')
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: 'Authorization header missing or invalid',
      }
    }

    const token = authHeader.substring(7)
    console.log('🔑 Token gefunden, validiere über Keycloak...')

    // Token validieren über Keycloak User Info Endpoint (einfacher für public clients)
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'

    console.log(
      '🌐 Verwende Keycloak URL:',
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`
    )

    // User Info Endpoint verwenden (validiert automatisch das Token)
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
      console.log(
        '❌ Token-Validierung fehlgeschlagen:',
        userInfoResponse.status,
        userInfoResponse.statusText
      )
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: `Token validation failed: ${userInfoResponse.status} ${userInfoResponse.statusText}`,
      }
    }

    console.log('✅ Token erfolgreich validiert')
    const userInfo = await userInfoResponse.json()

    // Token payload dekodieren für Rolleninformationen
    let tokenPayload: any
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]))
    } catch (authError) {
      console.log('❌ Token-Dekodierung fehlgeschlagen:', authError)
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: authError instanceof Error ? authError.message : 'Invalid token format',
      }
    }

    // Client ID für Rollen-Extraktion
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'eam-client'

    // Rollen aus Token extrahieren
    const realmAccess = tokenPayload.realm_access?.roles || []
    const resourceAccess = tokenPayload.resource_access?.[clientId]?.roles || []
    const allRoles = [...realmAccess, ...resourceAccess]

    console.log('👤 Benutzer-Rollen:', allRoles)
    const isAdmin = allRoles.includes('admin')
    console.log('🔐 Ist Admin:', isAdmin)

    // Wenn Admin-Berechtigung erforderlich, aber nicht vorhanden
    if (requireAdmin && !isAdmin) {
      console.log('❌ Admin-Berechtigung erforderlich, aber nicht vorhanden')
      return {
        isAuthenticated: true,
        isAdmin: false,
        error: 'Admin privileges required',
      }
    }

    console.log('✅ Authentifizierung erfolgreich')
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
    console.log('🔐 withAuth Middleware gestartet für:', request.url)

    const authResult = await validateAuth(request, requireAdmin)

    if (!authResult.isAuthenticated) {
      console.log('❌ Authentifizierung fehlgeschlagen:', authResult.error)
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    if (requireAdmin && !authResult.isAdmin) {
      console.log('❌ Admin-Berechtigung erforderlich')
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }

    console.log('✅ Authentifizierung erfolgreich, führe Handler aus')
    return handler(request, authResult)
  }
}
