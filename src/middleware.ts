import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { JWTPayload, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // If the user is trying to access /login and he is already logged in, redirect him to the dashboard
  if (pathname === '/login' && token) {
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secretKey);
      // If the token is valid, redirect to the dashboard or home page
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } catch (error) {
      console.error('JWT verification failed:', error);
      // Continue to /login if token verification fails
    }
  }

  // Handle other routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = (payload as JWTPayload & { userId: string }).userId;

    if (userId) {
      req.nextUrl.searchParams.set('userId', userId);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|identity|favicon.ico|login|register|email-confirmation).*)',
    // Include /login in the matcher to handle logged-in redirection
    '/login',
  ],
};
