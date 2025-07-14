import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Unterstützte Locales
const locales = ['de', 'en'] as const
type Locale = (typeof locales)[number]

// Standard-Locale
const defaultLocale: Locale = 'de'

// Locale aus Accept-Language Header ermitteln
function getLocale(request: NextRequest): Locale {
  // Zuerst prüfen, ob bereits ein Locale-Cookie gesetzt ist
  const cookieLocale = request.cookies.get('locale')?.value as Locale
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Accept-Language Header auswerten
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Einfache Implementierung der Locale-Erkennung
    const preferredLanguages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .map(lang => lang.split('-')[0]) // Nur Sprachcode (de, en, etc.)

    for (const lang of preferredLanguages) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale
      }
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Prüfen, ob bereits ein Locale im Pfad enthalten ist
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Locale ermitteln und umleiten
  const locale = getLocale(request)

  // Neue URL mit Locale-Präfix erstellen
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Response mit Umleitung erstellen
  const response = NextResponse.redirect(newUrl)

  // Locale-Cookie setzen für zukünftige Requests
  response.cookies.set('locale', locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 Jahr
  })

  return response
}

export const config = {
  matcher: [
    // Alle Pfade außer:
    // - API-Routen (/api)
    // - Static-Assets (_next/static)
    // - Favicon und andere public-Dateien
    // - Manifest und andere Metadaten
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}
