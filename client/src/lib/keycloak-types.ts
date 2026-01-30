/**
 * Keycloak Type Definitions
 *
 * These types are used throughout the application for type-safe Keycloak user management.
 * All actual Keycloak operations are handled through API routes.
 */

/**
 * Keycloak User Representation
 */
export interface KeycloakUser {
  id?: string
  username: string
  email?: string
  firstName?: string
  lastName?: string
  enabled?: boolean
  emailVerified?: boolean
  attributes?: Record<string, string[]>
  createdTimestamp?: number
  requiredActions?: string[]
  realmRoles?: string[]
  clientRoles?: Record<string, string[]>
}

/**
 * Keycloak Role Representation
 */
export interface KeycloakRole {
  id?: string
  name: string
  description?: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string
}

/**
 * Keycloak Admin Error
 */
export class KeycloakAdminError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'KeycloakAdminError'
  }
}
