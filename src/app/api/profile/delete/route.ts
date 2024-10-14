import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function DELETE(req: Request) {
  const client = await db.connect();

  try {
    const { id, password } = await req.json();

    // Step 1: Validate input
    if (!id || typeof id !== 'string' || id.trim() === '' || !password) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Check if the user exists and get the hashed password
    const selectQuery = `
      SELECT password
      FROM users
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const { password: hashedPassword } = currentDataResult.rows[0];

    // Step 3: Verify the password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'password-invalid' }, { status: 401 });
    }

    // Step 4: Execute the delete query
    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;
    const result = await client.query(deleteQuery, [id]);

    // Step 5: Check if a user was deleted
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'user-deleted-successfully',
      deletedUserId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-delete-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
