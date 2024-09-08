import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id } = body;

    // Step 1: Check if the user exists
    const selectQuery = `
      SELECT complete
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 2: Check if the data is up-to-date
    if (currentData.complete === true) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 3: Update the user data if needed
    const currentDate = new Date().toISOString();
    const updateQuery = `
      UPDATE users 
      SET complete = true, last_action = $2, online = true
      WHERE id = $1
      RETURNING id, complete, last_action, online;
    `;
    const updateValues = [id, currentDate];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({ message: 'user-updated-successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
