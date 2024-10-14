import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function DELETE(req: Request) {
  const client = await db.connect();

  try {
    const { id } = await req.json();

    // Step 1: Validate that an ID is provided
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Execute the delete query
    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;
    const result = await client.query(deleteQuery, [id]);

    // Step 3: Check if a user was deleted
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
