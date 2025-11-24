import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'

interface JWTPayload {
  sub?: string
  email?: string
  preferred_username?: string
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { lastLogin } = await request.json()

    if (!lastLogin) {
      return NextResponse.json({ error: 'lastLogin is required' }, { status: 400 })
    }

    // JWT dekodieren um die Benutzer-ID zu erhalten
    const decoded = jwt.decode(token) as JWTPayload
    if (!decoded?.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.sub

    // Retrieve admin token for Keycloak API (mit Benutzername/Passwort wie andere APIs)
    const adminTokenResponse = await fetch(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: process.env.KEYCLOAK_ADMIN || 'admin',
          password: process.env.KEYCLOAK_ADMIN_PASSWORD || '',
        }),
      }
    )

    if (!adminTokenResponse.ok) {
      const errorText = await adminTokenResponse.text()
      console.error('❌ DEBUG: Admin Token Request Failed')
      console.error('Status:', adminTokenResponse.status)
      console.error('Status Text:', adminTokenResponse.statusText)
      console.error('Error Response:', errorText)
      console.error('Environment Check:')
      console.error('- KEYCLOAK_URL:', KEYCLOAK_URL)
      console.error('- KEYCLOAK_ADMIN:', process.env.KEYCLOAK_ADMIN || 'NOT_SET')
      console.error(
        '- KEYCLOAK_ADMIN_PASSWORD:',
        process.env.KEYCLOAK_ADMIN_PASSWORD ? 'SET' : 'NOT_SET'
      )
      return NextResponse.json(
        {
          error: 'Failed to get admin token',
          debug: {
            status: adminTokenResponse.status,
            statusText: adminTokenResponse.statusText,
            keycloakUrl: KEYCLOAK_URL,
            adminUser: process.env.KEYCLOAK_ADMIN || 'NOT_SET',
            passwordSet: !!process.env.KEYCLOAK_ADMIN_PASSWORD,
          },
        },
        { status: 500 }
      )
    }

    const adminTokenData = await adminTokenResponse.json()
    const adminToken = adminTokenData.access_token

    // Zuerst aktuellen Benutzer abrufen um bestehende Attribute zu erhalten
    const userResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    )

    if (!userResponse.ok) {
      console.error('❌ DEBUG: User Data Request Failed')
      console.error('Status:', userResponse.status)
      console.error('User ID:', userId)
      console.error('URL:', `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`)
      const errorText = await userResponse.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        {
          error: 'Failed to get user data',
          debug: {
            status: userResponse.status,
            userId,
            url: `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
          },
        },
        { status: 500 }
      )
    }

    const userData = await userResponse.json()
    const existingAttributes = userData.attributes || {}

    // Update user attribute
    const updateResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...userData,
          attributes: {
            ...existingAttributes,
            lastLogin: [lastLogin],
          },
        }),
      }
    )

    if (!updateResponse.ok) {
      console.error('❌ DEBUG: User Update Failed')
      console.error('Status:', updateResponse.status)
      console.error('User ID:', userId)
      console.error('Update URL:', `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`)
      console.error('Existing Attributes:', JSON.stringify(existingAttributes, null, 2))
      console.error('New lastLogin value:', lastLogin)
      const errorText = await updateResponse.text()
      console.error('Error Response:', errorText)

      // Spezifische Berechtigungsfehler identifizieren
      if (updateResponse.status === 403) {
        console.error(
          '❌ PERMISSION DENIED: Admin user lacks "manage-users" role in realm-management client'
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to update user attribute',
          debug: {
            status: updateResponse.status,
            userId,
            lastLogin,
            existingAttributes,
            errorText,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Last login date updated successfully',
      lastLogin,
    })
  } catch (error) {
    console.error('Fehler beim Aktualisieren des letzten Login-Datums:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
