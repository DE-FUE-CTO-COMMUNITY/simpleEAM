import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthResult } from '../../../../lib/auth-middleware'

type SyncResultItem = {
  userId: string
  email?: string
  companyIds: string[]
  updated: boolean
  error?: string
}

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const REALM = KEYCLOAK_REALM
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'

export const POST = withAuth(async (request: NextRequest, auth: AuthResult) => {
  try {
    // Only admins are allowed to execute this action (zusätzliche Absicherung)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }

    // Retrieve admin token for Keycloak Admin API
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

    // Load all users
    const usersResp = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM}/users?briefRepresentation=false`,
      { headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' } }
    )
    if (!usersResp.ok) {
      const errorText = await usersResp.text()
      return NextResponse.json(
        { error: 'Failed to fetch users', details: errorText },
        { status: usersResp.status }
      )
    }
    const users: any[] = await usersResp.json()

    // Use calling admin token for GraphQL
    const bearer = request.headers.get('authorization') || ''

    const results: SyncResultItem[] = []

    // Iterate serially to avoid overloading
    for (const user of users) {
      const userId: string | undefined = user?.id
      const email: string | undefined = user?.email

      if (!userId || !email) {
        results.push({
          userId: userId || 'unknown',
          email,
          companyIds: [],
          updated: false,
          error: 'Missing userId or email',
        })
        continue
      }

      try {
        // Person per Email im Graph suchen
        const gqlResp = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: bearer,
          },
          body: JSON.stringify({
            query: `query GetPersonByEmail($email: String!) {
              people(where: { email: { eq: $email } }) {
                company { id }
              }
            }`,
            variables: { email },
          }),
        })
        if (!gqlResp.ok) {
          const txt = await gqlResp.text()
          results.push({
            userId,
            email,
            companyIds: [],
            updated: false,
            error: `GraphQL error: ${gqlResp.status} ${txt}`,
          })
          continue
        }
        const gqlData = await gqlResp.json()
        const people = gqlData?.data?.people || []

        // Person.company is an array -> extract IDs
        const companies = (people[0]?.company ?? []) as Array<{ id?: string }>
        const companyIdsRaw: string[] = Array.isArray(companies)
          ? companies.map(c => c.id).filter((id): id is string => Boolean(id))
          : []

        // Normalize: unique, sorted list for stable comparison
        const normalize = (arr: string[]) => Array.from(new Set(arr)).sort()
        const companyIds = normalize(companyIdsRaw)

        // Load current user from Keycloak to merge attributes
        const kcUserResp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`, {
          headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        })
        if (!kcUserResp.ok) {
          const txt = await kcUserResp.text()
          results.push({
            userId,
            email,
            companyIds,
            updated: false,
            error: `Failed to fetch user for merge: ${txt}`,
          })
          continue
        }
        const kcUser = await kcUserResp.json()
        const existingAttributes = (kcUser.attributes || {}) as Record<string, any>

        // Only update if something changes
        const prevRaw = (existingAttributes.company_ids as string[]) || []
        const prev = Array.isArray(prevRaw) ? prevRaw : []
        const same = normalize(prev).join(',') === companyIds.join(',')

        if (same) {
          results.push({ userId, email, companyIds, updated: false })
          continue
        }

        const updateResp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...kcUser,
            attributes: {
              ...existingAttributes,
              company_ids: companyIds,
            },
          }),
        })

        if (!updateResp.ok) {
          const txt = await updateResp.text()
          results.push({
            userId,
            email,
            companyIds,
            updated: false,
            error: `Failed to update user: ${txt}`,
          })
          continue
        }

        results.push({ userId, email, companyIds, updated: true })
      } catch (e: any) {
        results.push({
          userId,
          email,
          companyIds: [],
          updated: false,
          error: e?.message || 'Unknown error',
        })
      }
    }

    const summary = {
      total: results.length,
      updated: results.filter(r => r.updated).length,
      skipped: results.filter(r => !r.updated && !r.error).length,
      failed: results.filter(r => r.error).length,
      results,
    }

    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('sync-company-ids error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error?.message },
      { status: 500 }
    )
  }
}, true) // requireAdmin
