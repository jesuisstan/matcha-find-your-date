import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/utils/server/check-user-details-filled';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, latitude, longitude, address } = body;

    // Step 1: Check if the user exists
    const selectQuery = `
      SELECT latitude, longitude, address
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 2: Check if the data is up-to-date
    if (
      currentData.latitude === latitude &&
      currentData.longitude === longitude &&
      currentData.address === address
    ) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 3: Update the user data if needed
    const currentDate = new Date().toISOString();
    const updateQuery = `
      UPDATE users
      SET latitude = $2, longitude = $3, address = $4, last_action = $5, online = true,
          raiting = CASE
                WHEN latitude IS NULL OR longitude IS NULL OR address IS NULL THEN
                  LEAST(raiting + 5, 100)
                ELSE raiting
              END
      WHERE id = $1
      RETURNING id, latitude, longitude, address, last_action, online, raiting;
    `;
    const updateValues = [id, latitude, longitude, address, currentDate];
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
