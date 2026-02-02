import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Define route patterns (matching with or without locale prefix)
  const isAuthPage = pathname.match(/^\/(?:en|es)\/auth/) || pathname.startsWith('/auth');
  const isDashboardPage = pathname.match(/^\/(?:en|es)\/dashboard/) || pathname.startsWith('/dashboard');

  // 1. Handle Authentication Redirects
  if (token && isAuthPage) {
    // Already logged in, move to dashboard
    const locale = pathname.match(/^\/(en|es)/)?.[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  if (!token && isDashboardPage) {
    // Not logged in, move to login
    const locale = pathname.match(/^\/(en|es)/)?.[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // 2. Run next-intl middleware for localization
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
