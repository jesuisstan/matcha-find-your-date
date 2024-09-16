import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/utils/server/check-user-details-filled';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, url } = body;

    // Step 1: Validate the photo received from the frontend
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json({ error: 'error-photo-type' }, { status: 400 });
    }

    // Step 2: Check if the user exists
    const selectQuery = `
      SELECT photos
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    // Step 3: Update the user's photos array by appending the new URL. Update the last action, online status, and rating in one query.
    const currentDate = new Date();
    const updateQuery = `
      UPDATE users 
      SET photos = array_append(photos, $2), last_action = $3, online = true, raiting = LEAST(raiting + 5, 100)
      WHERE id = $1
      RETURNING id, photos, last_action, online, raiting;
    `;
    const updateValues = [id, url, currentDate.toISOString()];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    // Check if all required fields are filled to determine `complete` status & Update the `complete` status if necessary
    const { complete, changedToCompleteFlag } = await checkIfUserDataIsFilled(client, id);
    if (changedToCompleteFlag) {
      await client.query('UPDATE users SET complete = $2 WHERE id = $1', [id, complete]);
    }

    return NextResponse.json({
      message: 'user-updated-successfully',
      user: { ...updatedUser, complete },
      changedToCompleteFlag,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
