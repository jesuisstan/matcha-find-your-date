import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, email, password } = body;

    // Step 1: Check if the user exists
    const selectQuery = `
      SELECT email, password
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 2: Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, currentData.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'password-invalid' }, { status: 401 });
    }

    // Step 3: Check if the data is up-to-date
    if (currentData.email === email) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 4: Update the user data if needed
    const currentDate = new Date().toISOString();
    const updateQuery = `
      UPDATE users 
      SET email = $2, last_action = $3, online = true
      WHERE id = $1
      RETURNING id, email, last_action, online;
    `;
    const updateValues = [id, email, currentDate];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({ message: 'email-changed-successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'email-change-error' }, { status: 500 });
  } finally {
    client.release();
  }
}
