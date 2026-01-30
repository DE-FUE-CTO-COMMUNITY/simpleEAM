import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

// Configuration for Next.js 15 - Internationalization with next-intl
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     */
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
