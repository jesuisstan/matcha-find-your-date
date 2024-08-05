import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|identity|favicon.ico|login|register).*)'],
};


//import { NextRequest } from 'next/server'

//import { isAuthenticated } from '@/lib/jwtTokenControl'

//// Limit the middleware to paths starting with `/api/`
//// matcher: ['/about/:path*', '/dashboard/:path*'],
//export const config = {
//  matcher: '/api/v1/:function*'
//  //matcher: ['/((?!api|_next/static|_next/image|identity|favicon.ico|login|register).*)'],

//}

//export async function middleware(request: NextRequest) {
//  const result = await isAuthenticated(request)
//console.log('result', result)
//  if (!result) {
//    return Response.json({ success: false, message: 'Invalid token. Paths starting with `/api/v1/`' }, { status: 401 })
//  }
//}