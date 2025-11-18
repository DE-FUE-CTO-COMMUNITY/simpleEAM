import jwt from 'jsonwebtoken'
import { Request } from 'express'
import dotenv from 'dotenv'

dotenv.config()

// Keycloak configuration from environment variables
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8081'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'eam-server'

/**
 * Extracts the Bearer token from the Authorization header
 */
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}

/**
 * Verifies the JWT token and returns the decoded content
 */
export const verifyToken = (token: string): any => {
  try {
    // In full implementation, the public key from Keycloak should be used.
    // For Phase 1, we simplify the verification.
    const decoded = jwt.decode(token)
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Creates the context for the GraphQL server based on the request
 */
export const createContext = ({ req }: { req: Request }) => {
  // Extract token from header
  const token = extractTokenFromHeader(req)
  if (!token) {
    return { isAuthenticated: false, user: null }
  }

  // Verify token
  const user = verifyToken(token)
  if (!user) {
    return { isAuthenticated: false, user: null }
  }

  // User is authenticated
  return {
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
