import { NextRequest, NextResponse } from 'next/server'

// Unterstützte Locales
const locales = ['de', 'en']
const defaultLocale = 'de'

// Funktion zur Ermittlung der bevorzugten Sprache aus dem Accept-Language Header
function getLocale(request: NextRequest): string {
  // Hole den Accept-Language Header
  const acceptLanguage = request.headers.get('accept-language')

  if (!acceptLanguage) {
    return defaultLocale
  }

  // Einfache Locale-Ermittlung basierend auf Accept-Language Header
  const requestLocales = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim())
    .map(lang => lang.split('-')[0]) // 'de-DE' -> 'de'

  // Finde die erste unterstützte Sprache
  for (const requestLocale of requestLocales) {
    if (locales.includes(requestLocale)) {
      return requestLocale
    }
  }

  return defaultLocale
}

export default function middleware(request: NextRequest) {
  // Überprüfe, ob bereits eine unterstützte Locale im Pfad vorhanden ist
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Wenn bereits eine Locale im Pfad ist, leite weiter
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Ermittle die bevorzugte Locale und leite um
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // Umleitung zur lokalisierten URL
  // z.B. /products -> /de/products
  return NextResponse.redirect(request.nextUrl)
}

// Konfiguration für Next.js 15 - Internationalisierung
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
