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
    // Validate the token by checking if it exists in the database
    const userResult = await client.sql`
      SELECT id FROM users WHERE service_token = ${token};
    `;

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: 'invalid-token' }, { status: 400 });
    }

    const userId = userResult.rows[0].id;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await client.sql`
      UPDATE users SET password = ${hashedPassword}, service_token = NULL WHERE id = ${userId};
    `;

    return NextResponse.json({ message: 'password-changed-successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'password-change-error' }, { status: 500 });
  } finally {
    client.release();
  }
}
