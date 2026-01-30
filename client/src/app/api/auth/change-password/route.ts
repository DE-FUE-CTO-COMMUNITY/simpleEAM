import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json()
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Nicht authentifiziert' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Decrypt token to get user information
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const userId = tokenPayload.sub
    const username = tokenPayload.preferred_username

    if (!userId || !username) {
      return NextResponse.json(
        { message: 'Benutzerinformationen nicht im Token gefunden' },
        { status: 400 }
      )
    }

    // Keycloak Admin API Konfiguration
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080'
    const realm = process.env.KEYCLOAK_REALM || 'simple-eam'
    const adminUsername = process.env.KEYCLOAK_ADMIN || 'admin'
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('KEYCLOAK_ADMIN_PASSWORD Umgebungsvariable nicht gesetzt')
      console.error(
        'Verfügbare Umgebungsvariablen:',
        Object.keys(process.env).filter(key => key.includes('KEYCLOAK'))
      )
      return NextResponse.json(
        { message: 'Server-Konfigurationsfehler: Admin-Passwort nicht verfügbar' },
        { status: 500 }
      )
    }

    // Retrieve admin token from Keycloak
    const adminTokenResponse = await fetch(
      `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: adminUsername,
          password: adminPassword,
        }),
      }
    )

    if (!adminTokenResponse.ok) {
      console.error('Fehler beim Abrufen des Admin-Tokens:', await adminTokenResponse.text())
      return NextResponse.json(
        { message: 'Fehler bei der Admin-Authentifizierung' },
        { status: 500 }
      )
    }

    const adminTokenData = await adminTokenResponse.json()
    const adminToken = adminTokenData.access_token

    // Change password via Keycloak Admin API
    const changePasswordResponse = await fetch(
      `${keycloakUrl}/admin/realms/${realm}/users/${userId}/reset-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          type: 'password',
          value: newPassword,
          temporary: false,
        }),
      }
    )

    if (!changePasswordResponse.ok) {
      const errorText = await changePasswordResponse.text()
      console.error('Fehler beim Ändern des Passworts:', errorText)
      return NextResponse.json({ message: 'Fehler beim Ändern des Passworts' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Passwort erfolgreich geändert',
      success: true,
    })
  } catch (error) {
    console.error('Fehler bei Passwort-Änderung:', error)
    return NextResponse.json({ message: 'Fehler bei der Passwort-Änderung' }, { status: 500 })
  }
}
