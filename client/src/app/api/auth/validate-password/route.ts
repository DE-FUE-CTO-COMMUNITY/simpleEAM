import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Nicht authentifiziert' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Keycloak Token Introspection Endpoint für Passwort-Validierung verwenden
    const keycloakUrl =
      process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
      process.env.KEYCLOAK_URL ||
      'https://auth.dev-server.mf2.eu'
    const realm =
      process.env.NEXT_PUBLIC_KEYCLOAK_REALM || process.env.KEYCLOAK_REALM || 'simple-eam'

    // Entschlüssele das Token, um den Benutzernamen zu erhalten
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const username = tokenPayload.preferred_username

    if (!username) {
      return NextResponse.json({ message: 'Benutzername nicht im Token gefunden' }, { status: 400 })
    }

    // Versuche Anmeldung mit dem aktuellen Passwort über Keycloak Token Endpoint
    const tokenResponse = await fetch(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'eam-client',
          username: username,
          password: password,
        }),
      }
    )

    if (tokenResponse.ok) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ message: 'Passwort ist nicht korrekt' }, { status: 400 })
    }
  } catch (error) {
    console.error('Fehler bei Passwort-Validierung:', error)
    return NextResponse.json({ message: 'Fehler bei der Passwort-Validierung' }, { status: 500 })
  }
}
