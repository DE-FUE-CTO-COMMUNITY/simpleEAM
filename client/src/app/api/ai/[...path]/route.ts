import { NextRequest, NextResponse } from 'next/server'

const AI_API_INTERNAL_URL =
  process.env.AI_API_INTERNAL_URL ||
  `http://localhost:${process.env.AI_SERVER_EXTERNAL_PORT || '4001'}`

const REQUEST_HEADER_BLACKLIST = new Set(['connection', 'content-length', 'host'])
const RESPONSE_HEADER_BLACKLIST = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'transfer-encoding',
])

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const stripTrailingSlash = (value: string) => value.replace(/\/$/, '')

const filterHeaders = (headers: Headers, blacklist: Set<string>) => {
  const filtered = new Headers()

  headers.forEach((value, key) => {
    if (!blacklist.has(key.toLowerCase())) {
      filtered.set(key, value)
    }
  })

  return filtered
}

const buildTargetUrl = (path: string[], request: NextRequest) => {
  const targetUrl = new URL(`${stripTrailingSlash(AI_API_INTERNAL_URL)}/${path.join('/')}`)

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value)
  })

  return targetUrl
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const targetUrl = buildTargetUrl(path, request)
  const headers = filterHeaders(request.headers, REQUEST_HEADER_BLACKLIST)

  try {
    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: 'manual',
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const body = await request.arrayBuffer()
      if (body.byteLength > 0) {
        init.body = body
      }
    }

    const response = await fetch(targetUrl, init)

    return new NextResponse(response.body, {
      status: response.status,
      headers: filterHeaders(response.headers, RESPONSE_HEADER_BLACKLIST),
    })
  } catch (error) {
    console.error('[AI API PROXY] Request failed', {
      method: request.method,
      targetUrl: targetUrl.toString(),
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ message: 'Failed to reach AI server' }, { status: 502 })
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}