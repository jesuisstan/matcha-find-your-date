import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id?: string;
    name?: string;
    username?: string;
    shortname?: string;
    email?: string;
    image?: string | null;
    roles?: any[];
    access_token?: string;
    tc_date?: string;
    profiles?: string[];
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface User {
    id?: string;
    name?: string;
    username?: string;
    shortname?: string;
    email?: string;
    image?: string | null;
    roles?: any[];
    access_token?: string;
    tc_date?: string;
    profiles?: string[];
  }
  interface JWT {
    sub: string;
    user: User;
    iat: number;
    exp: number;
    jti: string;
  }
}
