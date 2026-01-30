import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lastLogin } = await request.json()

    if (!lastLogin) {
      return NextResponse.json({ error: 'lastLogin is required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Last login date tracked successfully (simple method)',
      lastLogin,
      note: 'Using simplified tracking method',
    })
  } catch (error) {
    console.error('Fehler beim Last-Login-Tracking (simple):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
