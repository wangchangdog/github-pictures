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

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === BLOCKED_REDIRECT_PATH) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get('user-agent') ?? ''

  if (blockedUserAgents.some((pattern) => pattern.test(userAgent))) {
    const url = request.nextUrl.clone()
    url.pathname = BLOCKED_REDIRECT_PATH
    url.search = ''

    return NextResponse.rewrite(url, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
