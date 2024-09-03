import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'missing-token-or-password' }, { status: 400 });
  }

  const client = await db.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE service_token = $1', [token]);

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: 'invalid-token' }, { status: 400 });
    }

    const userId = userResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const currentDate = new Date().toISOString();

    await client.query(
      'UPDATE users SET password = $1, service_token = NULL, last_action = $2 WHERE id = $3',
      [hashedPassword, currentDate, userId]
    );

    return NextResponse.json({ message: 'password-changed-successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'password-change-error' }, { status: 500 });
  } finally {
    client.release();
  }
}
