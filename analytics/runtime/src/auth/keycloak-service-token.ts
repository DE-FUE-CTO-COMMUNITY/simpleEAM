interface TokenResponse {
  access_token?: string
}

const buildTokenEndpoint = (): string | null => {
  const keycloakUrl = process.env.KEYCLOAK_URL?.trim()
  const keycloakRealm = process.env.KEYCLOAK_REALM?.trim()

  if (!keycloakUrl || !keycloakRealm) return null

  return `${keycloakUrl.replace(/\/$/, '')}/realms/${encodeURIComponent(keycloakRealm)}/protocol/openid-connect/token`
}

const getBootstrapClientId = (): string =>
  (
    process.env.AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_ID ||
    process.env.KEYCLOAK_CLIENT_ID_SERVER ||
    process.env.KEYCLOAK_CLIENT_ID ||
    ''
  ).trim()

const getBootstrapClientSecret = (): string =>
  (
    process.env.AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_SECRET ||
    process.env.KEYCLOAK_CLIENT_SECRET_SERVER ||
    process.env.KEYCLOAK_CLIENT_SECRET ||
    ''
  ).trim()

export const fetchServiceAccessToken = async (): Promise<string | null> => {
  const endpoint = buildTokenEndpoint()
  const clientId = getBootstrapClientId()
  const clientSecret = getBootstrapClientSecret()

  if (!endpoint || !clientId || !clientSecret) return null

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const payloadText = await response.text().catch(() => '')
    throw new Error(`Failed to fetch service token (${response.status}): ${payloadText}`)
  }

  const payload = (await response.json()) as TokenResponse
  if (!payload.access_token) {
    throw new Error('Keycloak token endpoint response missing access_token')
  }

  return payload.access_token
}
