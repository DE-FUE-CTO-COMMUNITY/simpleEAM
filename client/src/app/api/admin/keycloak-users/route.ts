import { NextRequest, NextResponse } from 'next/server'

// API Route für Keycloak Admin Operationen
export async function GET(_request: NextRequest) {
  try {
    // Admin Token holen
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'
    
    const tokenResponse = await fetch(`${keycloakUrl}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: process.env.KEYCLOAK_ADMIN || 'admin',
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json(
        { error: `Admin Token Request failed: ${tokenResponse.status} ${tokenResponse.statusText}`, details: errorText },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const adminToken = tokenData.access_token

    // Benutzer laden
    const usersResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users?briefRepresentation=false`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text()
      return NextResponse.json(
        { error: `Users Request failed: ${usersResponse.status} ${usersResponse.statusText}`, details: errorText },
        { status: usersResponse.status }
      )
    }

    const users = await usersResponse.json()

    // Für jeden Benutzer die Rollen laden
    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        if (user.id) {
          try {
            const rolesResponse = await fetch(
              `${keycloakUrl}/admin/realms/${realm}/users/${user.id}/role-mappings/realm`,
              {
                headers: {
                  'Authorization': `Bearer ${adminToken}`,
                  'Content-Type': 'application/json',
                },
              }
            )

            if (rolesResponse.ok) {
              const roles = await rolesResponse.json()
              return {
                ...user,
                realmRoles: roles.map((role: any) => role.name),
              }
            }
          } catch (error) {
            console.warn(`Fehler beim Laden der Rollen für Benutzer ${user.username}:`, error)
          }
        }
        return user
      })
    )

    return NextResponse.json(usersWithRoles)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, userData } = body

    // Admin Token holen
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'
    
    const tokenResponse = await fetch(`${keycloakUrl}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: process.env.KEYCLOAK_ADMIN || 'admin',
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json(
        { error: `Admin Token Request failed: ${tokenResponse.status} ${tokenResponse.statusText}`, details: errorText },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const adminToken = tokenData.access_token

    let apiResponse
    
    switch (action) {
      case 'create':
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        break

      case 'update':
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        break

      case 'delete':
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      return NextResponse.json(
        { error: `${action} failed: ${apiResponse.status} ${apiResponse.statusText}`, details: errorText },
        { status: apiResponse.status }
      )
    }

    // 204 No Content für erfolgreiche Updates/Deletes
    if (apiResponse.status === 204) {
      return NextResponse.json({ success: true })
    }

    const result = await apiResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
