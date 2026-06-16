import { NextRequest, NextResponse } from 'next/server'

const AUTH_TOKEN_COOKIE = process.env.AUTH_TOKEN_COOKIE_NAME ?? 'auth_token'
const IS_MSW_ACTIVE = process.env.NEXT_PUBLIC_MSW === 'true'

const PUBLIC_PATHS = ['/login']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  if (IS_MSW_ACTIVE) {
    const devRole = request.cookies.get('dev_role')
    if (devRole?.value && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (!devRole?.value && !isPublicPath(pathname)) {
      const response = NextResponse.next()
      response.cookies.set('dev_role', 'admin', { path: '/' })
      return response
    }
    return NextResponse.next()
  }

  const tokenCookie = request.cookies.get(AUTH_TOKEN_COOKIE)
  const isAuthenticated = Boolean(tokenCookie?.value)

  if (!isAuthenticated && !isPublicPath(pathname) && pathname !== '/') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|.*\\..*).*)'],
}