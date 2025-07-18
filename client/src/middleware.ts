import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

// Konfiguration für Next.js 15 - Internationalisierung mit next-intl
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     * - Dateien mit Punkten (z.B. favicon.ico)
     */
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
