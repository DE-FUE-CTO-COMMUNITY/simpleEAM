import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

import { extractTokenFromHeader, verifyToken } from '../auth/auth-jwks'

interface AnalyticsJwtPayload extends JwtPayload {
  preferred_username?: string
  email?: string
  company_ids?: string[]
  realm_access?: {
    roles?: string[]
  }
}

export interface AnalyticsUser {
  readonly token: string
  readonly sub: string
  readonly username: string
  readonly email: string | null
  readonly roles: readonly string[]
  readonly companyIds: readonly string[]
  readonly isAdmin: boolean
}

export async function authenticateAnalyticsRequest(req: Request): Promise<AnalyticsUser | null> {
  const token = extractTokenFromHeader(req)
  if (!token) {
    return null
  }

  const decoded = (await verifyToken(token)) as AnalyticsJwtPayload | null
  if (!decoded?.sub) {
    return null
  }

  const roles = decoded.realm_access?.roles ?? []

  return {
    token,
    sub: decoded.sub,
    username: decoded.preferred_username ?? decoded.email ?? decoded.sub,
    email: decoded.email ?? null,
    roles,
    companyIds: decoded.company_ids ?? [],
    isAdmin: roles.includes('admin'),
  }
}

export function canAccessCompany(user: AnalyticsUser, companyId: string | null): boolean {
  if (!companyId) {
    return true
  }

  return user.isAdmin || user.companyIds.includes(companyId)
}

export function hasAnalyticsWriteAccess(user: AnalyticsUser): boolean {
  return user.isAdmin || user.roles.includes('architect')
}
