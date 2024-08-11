import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/email-confirmation?error=invalid-token', req.url));
  }

  const client = await db.connect();

  try {
    const result = await client.sql`
      UPDATE users
      SET confirmed = true
      WHERE service_token = ${token}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.redirect(new URL('/email-confirmation?error=invalid-token', req.url));
    }

    return NextResponse.redirect(
      new URL('/email-confirmation?message=email-confirmed-successfully', req.url)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(
      new URL('/email-confirmation?error=failed-to-confirm-email', req.url)
    );
  } finally {
    client.release();
  }
}
