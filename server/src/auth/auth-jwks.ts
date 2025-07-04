import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-client'
import { Request } from 'express'
import dotenv from 'dotenv'

dotenv.config()

// JWKS-Client für Keycloak
const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  requestHeaders: {}, // Optionale zusätzliche Headers
  timeout: 30000, // Zeitüberschreitung in Millisekunden (30 Sekunden)
  cache: true, // Cache die öffentlichen Schlüssel
  cacheMaxEntries: 5, // Maximale Anzahl der zwischengespeicherten Schlüssel
  // cacheMaxAge entfernt - verursacht Probleme mit neueren lru-cache Versionen
})

/**
 * Extrahiert das Bearer-Token aus dem Authorization-Header
 */
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // "Bearer " entfernen
}

/**
 * Holt den öffentlichen Schlüssel für die JWT-Verifikation von Keycloak
 */
const getKey = (header: jwt.JwtHeader, callback: (err: Error | null, key?: string) => void) => {
  if (!header.kid) {
    return callback(new Error('JWT Header enthält keine Key ID (kid)'))
  }

  client.getSigningKey(header.kid, (err: Error | null, key?: unknown) => {
    if (err) {
      console.error('Fehler beim Abrufen des Signing-Keys:', err)
      return callback(err)
    }

    if (!key) {
      return callback(new Error('Kein Schlüssel erhalten'))
    }

    // Die API kann unterschiedlich sein - versuche verschiedene Zugriffsarten
    let signingKey: string | undefined

    // Versuche die verschiedenen möglichen API-Strukturen
    if (typeof key === 'object' && key !== null) {
      const keyObj = key as Record<string, unknown>

      if (typeof keyObj.getPublicKey === 'function') {
        signingKey = keyObj.getPublicKey() as string
      } else if (typeof keyObj.publicKey === 'string') {
        signingKey = keyObj.publicKey
      } else if (typeof keyObj.rsaPublicKey === 'string') {
        signingKey = keyObj.rsaPublicKey
      } else {
        console.error('Unbekannte Schlüssel-Struktur:', Object.keys(keyObj))
        return callback(new Error('Unbekannte Schlüssel-Struktur'))
      }
    } else {
      return callback(new Error('Schlüssel ist kein Objekt'))
    }

    if (!signingKey) {
      return callback(new Error('Konnte öffentlichen Schlüssel nicht extrahieren'))
    }

    callback(null, signingKey)
  })
}

/**
 * Überprüft die Gültigkeit eines JWT-Tokens mit Keycloak JWKS
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
          console.error('Token-Verifizierungsfehler:', err)
          return resolve(null)
        }
        resolve(decoded as jwt.JwtPayload)
      }
    )
  })
}

/**
 * Erstellt den Kontext für den GraphQL-Server basierend auf der Anfrage
 * Wichtig: Für Neo4j GraphQL Library muss das Token direkt im Request Header bereitgestellt werden
 */
export const createContext = async ({ req }: { req: Request }) => {
  // Token aus Header extrahieren
  const token = extractTokenFromHeader(req)

  if (!token) {
    return {
      req, // Request für Neo4j GraphQL Library weiterleiten
      token: null,
      jwt: null,
      isAuthenticated: false,
      user: null,
    }
  }

  // Token überprüfen (optional für Debug, aber Neo4j GraphQL Library macht eigene Verifikation)
  const user = await verifyToken(token)

  if (!user) {
    return {
      req, // Request für Neo4j GraphQL Library weiterleiten
      token: null,
      jwt: null,
      isAuthenticated: false,
      user: null,
    }
  }

  // Benutzer ist authentifiziert - Request mit Token für Neo4j GraphQL Library bereitstellen
  // Rollen aus realm_access extrahieren und direkt im JWT verfügbar machen
  const jwtForNeo4j = {
    sub: user.sub,
    preferred_username: user.preferred_username,
    email: user.email,
    roles: user.realm_access?.roles || [],
  }

  return {
    req, // Request mit Authorization Header für Neo4j GraphQL Library
    token: token, // Rohes Token für Neo4j GraphQL Library
    jwt: jwtForNeo4j, // Angepasstes JWT für Neo4j GraphQL Library mit direkten Rollen
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
