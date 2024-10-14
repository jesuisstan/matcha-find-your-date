import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId } = body;

    // Step 1: Ensure the user exists
    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Step 2: Fetch mutual matches (users that have liked each other)
    const query = `
      SELECT 
        users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
        users.address, users.online, users.rating, users.sex_preferences
      FROM matches
      JOIN users ON (matches.user_one_id = users.id OR matches.user_two_id = users.id)
      WHERE (matches.user_one_id = $1 OR matches.user_two_id = $1)
      AND users.id != $1
      AND users.confirmed = true
      AND users.complete = true
    `;

    const matchesResult = await client.query(query, [userId]);

    // Step 3: Update user's last_action and online status
    const currentDate = new Date().toISOString();
    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [userId, currentDate]
    );

    const updatedUser = updatedUserResult.rows[0];

    // Step 4: Return the matches and updated user data
    return NextResponse.json({
      matches: matchesResult.rows,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'error-fetching-matches' }, { status: 500 });
  } finally {
    client.release();
  }
}
