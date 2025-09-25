import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const blockedUserAgents = [
  /Googlebot/i,
  /Bingbot/i,
  /DuckDuckBot/i,
  /Baiduspider/i,
  /YandexBot/i,
  /Sogou/i,
  /Exabot/i,
  /facebot/i,
  /ia_archiver/i,
  /GPTBot/i,
  /ChatGPT-User/i,
  /Google-Extended/i,
  /LensoAI/i,
  /LensoBot/i,
  /Lenso\.ai/i,
  /PimEyesBot/i,
  /PimEyes/i,
]

const BLOCKED_REDIRECT_PATH = '/403.html'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === BLOCKED_REDIRECT_PATH) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get('user-agent') ?? ''

  if (blockedUserAgents.some((pattern) => pattern.test(userAgent))) {
    const blockedPageUrl = new URL(BLOCKED_REDIRECT_PATH, request.url)
    const blockedPageResponse = await fetch(blockedPageUrl)

    if (blockedPageResponse.ok) {
      const body = await blockedPageResponse.text()

      return new NextResponse(body, {
        status: 403,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      })
    }

    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
