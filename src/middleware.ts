// import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import { verifyToken } from '@/lib/auth';

// import i18n from '../i18n';
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|identity|favicon.ico|reset-password).*)'],
};

export default withAuth(
  // async function middleware(req) {
  //   const locale = req.nextUrl.locale || i18n.defaultLocale;
  //   req.nextUrl.searchParams.set('lang', locale);
  //   NextResponse.rewrite(req.nextUrl);
  //   return NextResponse.redirect(req.nextUrl.href);
  // },

  {
    pages: {
      signIn: '/login',
    },

    callbacks: {
      authorized: async ({ token, req: { nextUrl } }: { token: any; req: NextRequest }) => {
        const accessToken = token?.user?.access_token;

        try {
          await verifyToken(accessToken);
          return true;
        } catch (error) {
          console.error('error', error);
          return false;
        }
      },
    },
  }
);
