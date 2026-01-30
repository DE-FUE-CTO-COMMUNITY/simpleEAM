import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthResult } from '@/lib/auth-middleware'

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const REALM = KEYCLOAK_REALM
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'

export const POST = withAuth(async (request: NextRequest, auth: AuthResult) => {
  try {
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }

    const { email } = (await request.json()) as { email?: string }
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    // Admin-Token holen
    const adminTokenResp = await fetch(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: process.env.KEYCLOAK_ADMIN || 'admin',
          password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
        }),
      }
    )
    if (!adminTokenResp.ok) {
      const errorText = await adminTokenResp.text()
      return NextResponse.json(
        { error: 'Failed to obtain admin token', details: errorText },
        { status: 500 }
      )
    }
    const { access_token: adminToken } = await adminTokenResp.json()

    // Keycloak-User per E-Mail suchen
    const usersResp = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM}/users?briefRepresentation=false&email=${encodeURIComponent(
        email
      )}`,
      { headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' } }
    )
    if (!usersResp.ok) {
      const text = await usersResp.text()
      return NextResponse.json(
        { error: 'Failed to query users', details: text },
        { status: usersResp.status }
      )
    }
    const users: any[] = await usersResp.json()
    const user = users.find(u => (u.email || '').toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({ success: true, updated: false, reason: 'user_not_found' })
    }

    const userId: string = user.id

    // GraphQL: fetch data
    const bearer = request.headers.get('authorization') || ''
    const gqlResp = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
      },
      body: JSON.stringify({
        query: `query GetPersonByEmail($email: String!) { people(where: { email: { eq: $email } }) { company { id } } }`,
        variables: { email },
      }),
    })
    if (!gqlResp.ok) {
      const txt = await gqlResp.text()
      return NextResponse.json(
        { error: 'GraphQL error', details: `${gqlResp.status} ${txt}` },
        { status: 500 }
      )
    }
    const data = await gqlResp.json()
    const companies = (data?.data?.people?.[0]?.company ?? []) as Array<{ id?: string }>
    const companyIds = Array.from(
      new Set(
        companies
          .map(c => c.id)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      )
    ).sort()

    // Fetch current user for merging
    const kcUserResp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    })
    if (!kcUserResp.ok) {
      const txt = await kcUserResp.text()
      return NextResponse.json(
        { error: 'Failed to fetch user for merge', details: txt },
        { status: kcUserResp.status }
      )
    }
    const kcUser = await kcUserResp.json()
    const existingAttributes = (kcUser.attributes || {}) as Record<string, any>
    const prev = Array.isArray(existingAttributes.company_ids)
      ? (existingAttributes.company_ids as string[])
      : []
    const norm = (arr: string[]) => Array.from(new Set(arr)).sort().join(',')
    const same = norm(prev) === norm(companyIds)
    if (same) {
      return NextResponse.json({ success: true, updated: false, companyIds })
    }

    const updateResp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...kcUser,
        attributes: { ...existingAttributes, company_ids: companyIds },
      }),
    })
    if (!updateResp.ok) {
      const txt = await updateResp.text()
      return NextResponse.json(
        { error: 'Failed to update user attributes', details: txt },
        { status: updateResp.status }
      )
    }

    return NextResponse.json({ success: true, updated: true, companyIds })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: e?.message },
      { status: 500 }
    )
  }
}, true)
