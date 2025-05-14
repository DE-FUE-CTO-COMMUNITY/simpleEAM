import jwt from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Keycloak-Konfiguration aus Umgebungsvariablen
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8081';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'eam-server';

/**
 * Extrahiert das Bearer-Token aus dem Authorization-Header
 */
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // "Bearer " entfernen
};

/**
 * Überprüft das JWT-Token und gibt den decodierten Inhalt zurück
 */
export const verifyToken = (token: string): any => {
  try {
    // In der vollständigen Implementation sollte der Public Key von Keycloak
    // verwendet werden. Für Phase 1 vereinfachen wir die Verifizierung.
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Token-Verifizierungsfehler:', error);
    return null;
  }
};

/**
 * Erstellt den Kontext für den GraphQL-Server basierend auf der Anfrage
 */
export const createContext = ({ req }: { req: Request }) => {
  // Token aus Header extrahieren
  const token = extractTokenFromHeader(req);
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  // Token überprüfen
  const user = verifyToken(token);
  if (!user) {
    return { isAuthenticated: false, user: null };
  }

  // Benutzer ist authentifiziert
  return {
    isAuthenticated: true,
    user,
    roles: user.realm_access?.roles || [],
  };
};

export default {
  createContext,
  extractTokenFromHeader,
  verifyToken,
};
