import { checkLogin } from '@/lib/api';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/login') && token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/api')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  } else if (token) {
    const loggedIn = await checkLogin(token);
    if (!loggedIn) {
      // Remove the token cookie
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      response.cookies.set('token', '', {
        maxAge: 0,
        path: '/',
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
