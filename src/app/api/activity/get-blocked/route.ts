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

    // Step 2: Fetch users that the current user has blocked but exclude those who also blocked the current user
    const query = `
      SELECT 
        users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
        users.address, users.online, users.rating, users.sex_preferences
      FROM blocked_users
      JOIN users ON blocked_users.blocked_user_id = users.id
      WHERE blocked_users.blocker_id = $1
      AND users.confirmed = true
      AND users.complete = true
      AND users.id NOT IN (
        SELECT blocker_id FROM blocked_users WHERE blocked_user_id = $1
      )
    `;

    const blockedProfilesResult = await client.query(query, [userId]);

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

    // Step 4: Return the blocked users and updated user data
    return NextResponse.json({
      blockedProfiles: blockedProfilesResult.rows,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    return NextResponse.json({ error: 'error-fetching-blocked-users' }, { status: 500 });
  } finally {
    client.release();
  }
}
