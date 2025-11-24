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
    const { companyIds } = (await request.json()) as { companyIds?: unknown }

    if (!Array.isArray(companyIds) || !companyIds.every(id => typeof id === 'string')) {
      return NextResponse.json({ error: 'companyIds must be an array of strings' }, { status: 400 })
    }

    // JWT dekodieren, um die Benutzer-ID zu erhalten
    const decoded = jwt.decode(token) as JWTPayload
    if (!decoded?.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.sub

    // Retrieve admin token for Keycloak API (Password Grant wie bei update-last-login)
    const adminTokenResponse = await fetch(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      console.error('Fehler beim Abrufen des Admin-Tokens:', adminTokenResponse.status, errorText)
      return NextResponse.json({ error: 'Failed to get admin token' }, { status: 500 })
    }

    const adminTokenData = await adminTokenResponse.json()
    const adminToken = adminTokenData.access_token as string

    // Aktuellen Benutzer abrufen, um bestehende Attribute zu mergen
    const userResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    )

    if (!userResponse.ok) {
      console.error(
        'Fehler beim Abrufen der Benutzerdaten:',
        userResponse.status,
        await userResponse.text()
      )
      return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 })
    }

    const userData = await userResponse.json()
    const existingAttributes = (userData.attributes || {}) as Record<string, string[]>

    // Update user attribute (als string[] für Multivalue-Mapper)
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
            company_ids: companyIds as string[],
          },
        }),
      }
    )

    if (!updateResponse.ok) {
      console.error('Fehler beim Aktualisieren des company_ids-Attributs:', updateResponse.status)
      return NextResponse.json({ error: 'Failed to update user attribute' }, { status: 500 })
    }

    return NextResponse.json({ success: true, companyIds })
  } catch (error) {
    console.error('Fehler beim Setzen von company_ids:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
