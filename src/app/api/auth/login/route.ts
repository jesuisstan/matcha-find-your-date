import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

import { updateUserRaitingForLogin } from '@/utils/server/update-rating';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function POST(request: Request) {
  const { email, password, nickname } = await request.json();
  const client = await db.connect();

  let result;
  // Get user by email or nickname
  if (nickname) {
    result = await client.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
  } else if (email) {
    result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    // result = await client.query(`SELECT * FROM users WHERE email = '${email}'`); // ! SQL Injection example
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

  // Update the last_action, online status and raiting of the user
  try {
    const currentDate = new Date();
    const updatedRaiting = updateUserRaitingForLogin(
      user.last_action,
      user.raiting,
      100,
      currentDate
    );
    const updateQuery = `
        UPDATE users 
        SET last_action = $2, online = true, raiting = $3
        WHERE id = $1
        RETURNING id, email, confirmed, firstname, lastname, nickname, birthdate, sex, biography, tags, complete, latitude, longitude, address, registration_date, last_action, online, raiting, sex_preferences, photos;
      `;
    const updateValues = [user.id, currentDate.toISOString(), updatedRaiting];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({ token, user: updatedUser });
  } catch (error) {
    console.error('Error updating last_action:', error);
    return NextResponse.json({ error: 'login-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
