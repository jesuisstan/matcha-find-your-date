import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Get user by email
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  //const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`); // ! SQL Injection example

  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: 'invalid-email-or-password' }, { status: 401 });
  }

  // Check if password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'invalid-email-or-password' }, { status: 401 });
  }

  // Check if email is confirmed
  if (!user.confirmed) {
    return NextResponse.json({ error: 'please-confirm-email-before-login' }, { status: 401 });
  }

  // Create JWT token
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // Token expires in 1 hour
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secretKey);

  return NextResponse.json({ token, user });
}
