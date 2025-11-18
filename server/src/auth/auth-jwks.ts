import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-client'
import { Request } from 'express'
import dotenv from 'dotenv'

dotenv.config()

// JWKS client for Keycloak
const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  requestHeaders: {}, // Optional additional headers
  timeout: 30000, // Timeout in milliseconds (30 Sekunden)
  cache: true, // Cache the public keys
  cacheMaxEntries: 5, // Maximum number of cached keys
  // cacheMaxAge removed - causes problems with newer lru-cache versions
})

/**
 * Extracts the Bearer token from the Authorization header
 */
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // "Bearer " remove
}

/**
 * Retrieves the public key for JWT verification from Keycloak
 */
const getKey = (header: jwt.JwtHeader, callback: (err: Error | null, key?: string) => void) => {
  if (!header.kid) {
    return callback(new Error('JWT Header does not contain Key ID (kid)'))
  }

  client.getSigningKey(header.kid, (err: Error | null, key?: unknown) => {
    if (err) {
      console.error('Error retrieving signing key:', err)
      return callback(err)
    }

    if (!key) {
      return callback(new Error('No key received'))
    }

    // The API may be different - try different access methods
    let signingKey: string | undefined

    // Try the various possible API structures
    if (typeof key === 'object' && key !== null) {
      const keyObj = key as Record<string, unknown>

      if (typeof keyObj.getPublicKey === 'function') {
        signingKey = keyObj.getPublicKey() as string
      } else if (typeof keyObj.publicKey === 'string') {
        signingKey = keyObj.publicKey
      } else if (typeof keyObj.rsaPublicKey === 'string') {
        signingKey = keyObj.rsaPublicKey
      } else {
        console.error('Unknown key structure:', Object.keys(keyObj))
        return callback(new Error('Unknown key structure'))
      }
    } else {
      return callback(new Error('Key is not an object'))
    }

    if (!signingKey) {
      return callback(new Error('Could not extract public key'))
    }

    callback(null, signingKey)
  })
}

/**
 * Verifies the validity of a JWT token with Keycloak JWKS
 */
export const verifyToken = async (token: string): Promise<jwt.JwtPayload | null> => {
  return new Promise((resolve, _reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.KEYCLOAK_CLIENT_ID_SERVER,
        issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          console.error('Token verification error:', err)
          return resolve(null)
        }
        resolve(decoded as jwt.JwtPayload)
      }
    )
  })
}

/**
 * Creates the context for the GraphQL server based on the request
 * Important: For Neo4j GraphQL Library the token must be provided directly in the request header
 */
export const createContext = async ({ req }: { req: Request }) => {
  // Extract token from header
  const token = extractTokenFromHeader(req)

  if (!token) {
    return {
      req, // Forward request for Neo4j GraphQL Library
      token: null,
      jwt: null,
      isAuthenticated: false,
      user: null,
    }
  }

  // Verify token (optional for debug, but Neo4j GraphQL Library does its own verification)
  const user = await verifyToken(token)

  if (!user) {
    return {
      req, // Forward request for Neo4j GraphQL Library
      token: null,
      jwt: null,
      isAuthenticated: false,
      user: null,
    }
  }

  // User is authenticated - provide request with token for Neo4j GraphQL Library
  // Extract roles from realm_access and make directly available in JWT
  const jwtForNeo4j = {
    sub: user.sub,
    preferred_username: user.preferred_username,
    email: user.email,
    roles: user.realm_access?.roles || [],
  }

  return {
    req, // Request with Authorization Header for Neo4j GraphQL Library
    token: token, // Raw token for Neo4j GraphQL Library
    jwt: jwtForNeo4j, // Adapted JWT for Neo4j GraphQL Library with direct roles
    isAuthenticated: true,
    user,
    roles: user.realm_access?.roles || [],
  }
}

export default {
  createContext,
  extractTokenFromHeader,
  verifyToken,
}
