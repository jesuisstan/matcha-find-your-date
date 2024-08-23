import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function POST(request: Request) {
  const { email, password, nickname } = await request.json();

  let result;
  // Get user by email or nickname
  if (nickname) {
    result = await db.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
  } else if (email) {
    result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    // result = await db.query(`SELECT * FROM users WHERE email = '${email}'`); // ! SQL Injection example
  }

  if (!result || !result.rows || result.rows.length === 0) {
    return NextResponse.json({ error: 'invalid-email-or-nickname' }, { status: 401 });
  }

  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: 'invalid-email-or-nickname' }, { status: 401 });
  }

  // Check if password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'password-invalid' }, { status: 401 });
  }

  // Check if email is confirmed
  if (!user.confirmed) {
    return NextResponse.json({ error: 'please-confirm-email-before-login' }, { status: 401 });
  }

  let token;
  try {
    // Create JWT token
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // Token expires in 1 hour
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secretKey);
  } catch (error) {
    console.error('Error creating JWT:', error);
    return NextResponse.json({ error: 'login-failed' }, { status: 500 });
  }

  // Update the last_connection_date
  const currentDate = new Date().toISOString();
  await db.query('UPDATE users SET last_connection_date = $1 WHERE id = $2', [
    currentDate,
    user.id,
  ]);

  // Create a sanitized user object to return (without password and service_token)
  const userResponse = {
    id: user.id,
    email: user.email,
    confirmed: user.confirmed,
    firstname: user.firstname,
    lastname: user.lastname,
    nickname: user.nickname,
    birthdate: user.birthdate,
    sex: user.sex,
    biography: user.biography,
    tags: user.tags,
    complete: user.complete,
    latitude: user.latitude,
    longitude: user.longitude,
    address: user.address,
    registration_date: user.registration_date,
    last_connection_date: currentDate, // set last connection date with currentDate value to avoid unnecessary user-data fetch
    online: user.online,
    popularity: user.popularity,
    sex_preferences: user.sex_preferences,
    photos: user.photos,
  };

  return NextResponse.json({ token, user: userResponse });
}
