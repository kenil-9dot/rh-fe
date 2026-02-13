import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Exclude static files, images, and next internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // file extensions like .ico, .png, etc.
  ) {
    return NextResponse.next()
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (sessionToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is NOT logged in and trying to access protected routes, redirect to login
  if (!sessionToken && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
