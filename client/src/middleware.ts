import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  // Sehr deutliche Logs
  console.log('='.repeat(50))
  console.log('🚀 MIDDLEWARE WURDE AUSGEFÜHRT!')
  console.log('🚀 Pfad:', request.nextUrl.pathname)
  console.log('🚀 Method:', request.method)
  console.log('🚀 Host:', request.nextUrl.host)
  console.log('='.repeat(50))

  return NextResponse.next()
}

// Konfiguration für Next.js 15 - sehr einfach
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    '/((?!_next|favicon.ico).*)',
  ],
}
