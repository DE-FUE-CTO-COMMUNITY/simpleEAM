import { NextRequest, NextResponse } from 'next/server'

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'nextgen-eam'

async function getAdminToken(): Promise<string | null> {
  const adminUsername = process.env.KEYCLOAK_ADMIN || 'admin'
  const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD

  if (!adminPassword) {
    console.error('KEYCLOAK_ADMIN_PASSWORD Umgebungsvariable nicht gesetzt')
    return null
  }

  const response = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: adminUsername,
      password: adminPassword,
    }),
  })

  if (!response.ok) {
    console.error('Fehler beim Abrufen des Admin-Tokens:', await response.text())
    return null
  }

  const data = await response.json()
  return data.access_token as string
}

/**
 * GET /api/auth/passkeys
 * Returns whether the current user has a passkey registered in Keycloak.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Nicht authentifiziert' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const userId: string | undefined = tokenPayload.sub

    if (!userId) {
      return NextResponse.json({ message: 'Benutzer-ID nicht im Token gefunden' }, { status: 400 })
    }

    const adminToken = await getAdminToken()
    if (!adminToken) {
      return NextResponse.json({ message: 'Server-Konfigurationsfehler' }, { status: 500 })
    }

    const credentialsResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/credentials`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    )

    if (!credentialsResponse.ok) {
      console.error('Fehler beim Abrufen der Credentials:', await credentialsResponse.text())
      return NextResponse.json(
        { message: 'Fehler beim Abrufen der Benutzer-Credentials' },
        { status: 500 }
      )
    }

    const credentials: Array<{ type: string }> = await credentialsResponse.json()
    const hasPasskey = credentials.some(c => c.type === 'webauthn-passwordless')

    return NextResponse.json({ hasPasskey })
  } catch (error) {
    console.error('Fehler beim Überprüfen von Passkeys:', error)
    return NextResponse.json({ message: 'Interner Serverfehler' }, { status: 500 })
  }
}
