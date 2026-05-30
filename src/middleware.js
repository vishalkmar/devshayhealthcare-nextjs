import { NextResponse } from 'next/server';

// Lightweight gate: redirect to the login page when the admin cookie is
// missing. Full JWT verification happens in the API route handlers
// (requireAdmin) — this only handles UX routing.
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname.startsWith('/admin/login');
  const hasCookie = req.cookies.get('devrishi_admin');

  if (pathname.startsWith('/admin') && !isLogin && !hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
