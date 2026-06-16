import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'laravel_session'
const IS_MSW_ACTIVE = process.env.NEXT_PUBLIC_MSW === 'true'

const PUBLIC_PATHS = ['/login']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Dev mode: MSW aktif → bypass semua auth check
  // User akan diinisialisasi oleh DevRoleSwitcher di client side
  if (IS_MSW_ACTIVE) {
    // Jika sudah ada dev_role cookie, redirect dari login ke home
    const devRole = request.cookies.get('dev_role')
    if (devRole?.value && isPublicPath(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Set default dev_role jika belum ada dan akses protected route
    if (!devRole?.value && !isPublicPath(pathname)) {
      const response = NextResponse.next()
      response.cookies.set('dev_role', 'admin', { path: '/' })
      return response
    }
    return NextResponse.next()
  }

  // Production: cek session cookie Laravel Sanctum
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  const isAuthenticated = Boolean(sessionCookie?.value)

  // Unauthenticated → redirect ke login
  if (!isAuthenticated && !isPublicPath(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Sudah login → tidak boleh akses login page
  if (isAuthenticated && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|.*\\..*).*)'],
}