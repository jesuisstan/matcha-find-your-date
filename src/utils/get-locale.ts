import { NextApiRequest, NextApiResponse } from 'next';

// get locale value on client side
export const getLocaleFromCookiesOnClientSide = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// get locale value on server side
export const getLocaleFromCookiesOnServerSide = (req: NextApiRequest): string | null => {
  const localeCookie = req.cookies['NEXT_LOCALE'];
  return localeCookie ? decodeURIComponent(localeCookie) : null;
};
