import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/utils/server/check-user-details-filled';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, biography } = body;

    // Step 0: Validate the biography length received from the frontend
    if (biography.trim().length < 42) {
      return NextResponse.json({ error: 'error-min-biography-length' }, { status: 400 });
    }
    if (biography.trim().length > 442) {
      return NextResponse.json({ error: 'error-max-biography-length' }, { status: 400 });
    }

    // Step 1: Check if the user exists
    const selectQuery = `
      SELECT biography
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 2: Check if the data is up-to-date
    if (currentData.biography === biography) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 3: Conditionally update the biography, last action, online status, and rating in one query
    const currentDate = new Date();
    const updateQuery = `
      UPDATE users
      SET biography = $2, last_action = $3, online = true,
          raiting = CASE
                WHEN biography IS NULL THEN
                  LEAST(raiting + 5, 100)
                ELSE raiting
              END
      WHERE id = $1
      RETURNING id, biography, last_action, online, raiting;
    `;
    const updateValues = [id, biography, currentDate.toISOString()];
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
