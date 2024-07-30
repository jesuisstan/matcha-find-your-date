import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import useUserStore from '@/stores/user';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const token = await login(credentials);
          // console.log('token', token);
          const { access_token } = token;

          const verifiedToken = await verifyToken(access_token);
          // console.log('verifiedToken', verifiedToken);

          const { id, username, shortname, roles, tc_date, profiles } = verifiedToken.sub;

          const userInfos = {
            id,
            username,
            shortname,
            roles,
            access_token,
            tc_date,
            profiles,
          };
          return userInfos;
        } catch (error) {
          throw new Error(
            "A error occured, we couldn't log you in. Please check your credentials."
          );
        }
      },
    }),
  ],
  // session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.tc_date) {
        token.user.tc_date = session.tc_date;
        token.user.access_token = session.access_token;
        return { ...token, ...session.user };
      }
      if (user) token.user = user;

      return token;
    },
    async session({ session, token }) {
      if (token && token.user) session.user = token.user;

      return session;
    },
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      // console.log('Redirect Callback', { url, baseUrl });

      const lang = useUserStore.getState().user?.lang; // TODO: not working need to be in database
      // console.log('lang from redirect callback', lang);

      // Allows relative callback URLs
      return baseUrl + `/dashboard?lang=${lang}`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

type Credentials = Record<'username' | 'password', string> | undefined;

async function login(credentials: Credentials) {
  const params = new URLSearchParams(credentials as Record<string, string>);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`, {
    method: 'POST',
    headers: {
      'User-Agent': 'front-macro',
    },
    body: params,
  });

  if (res.status === 401) throw new Error('Bad Credentials');
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not Found');
  if (res.status === 500) throw new Error('Internal Server Error');

  const token = await res.json();

  return token;
}

export async function verifyToken(token: string) {
  const verifyToken = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/verify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (verifyToken.status === 401) throw new Error('Bad Token');
  if (verifyToken.status === 403) throw new Error('Forbidden');
  if (verifyToken.status === 404) throw new Error('Not Found');
  if (verifyToken.status === 500) throw new Error('Internal Server Error');

  const verifiedToken = await verifyToken.json();

  return verifiedToken;
}
