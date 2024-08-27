import { NextResponse } from 'next/server';

import { del } from '@vercel/blob';
import { db } from '@vercel/postgres';

export async function DELETE(req: Request): Promise<NextResponse> {
  const client = await db.connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    const photoUrl = searchParams.get('url');

    // Step 1: Validate inputs
    if (!userId || !photoUrl) {
      return NextResponse.json({ error: 'missing-parameters' }, { status: 400 });
    }

    // Step 2: Delete the photo from Vercel Blob Storage
    try {
      await del(photoUrl);
    } catch (error) {
      console.error('Error deleting photo:', error);
      return NextResponse.json({ error: 'failed-to-delete-photo' }, { status: 500 });
    }

    // Step 3: Remove the photo URL from the user's photos[] array in PostgreSQL
    const updateQuery = `
      UPDATE users 
      SET photos = array_remove(photos, $2)
      WHERE id = $1
      RETURNING id, photos;
    `;
    const updateValues = [userId, photoUrl];
    const updatedUserResult = await client.query(updateQuery, updateValues);

    if (updatedUserResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const updatedUser = updatedUserResult.rows[0];
    return NextResponse.json({ message: 'photo-deleted-successfully', user: updatedUser });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'failed-to-delete-photo' }, { status: 500 });
  } finally {
    client.release();
  }
}
