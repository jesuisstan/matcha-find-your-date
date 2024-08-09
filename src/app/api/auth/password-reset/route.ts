import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/password-reset?token=invalid-token', req.url));
  }

  return NextResponse.redirect(new URL(`/password-reset?token=${token}`, req.url));
}
