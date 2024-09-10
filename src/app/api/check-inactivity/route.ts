import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

const INACTIVITY_PERIOD_MINUTES = 10;

export async function GET() {
  const client = await db.connect();

  try {
    // Fetch users who are currently online
    const onlineUsersResult = await client.query(`SELECT * FROM users WHERE online = true`);

    // Fetch users who have been inactive for more than INACTIVITY_PERIOD_MINUTES
    const inactiveUsersResult = await client.query(`
      SELECT * FROM users
      WHERE last_action < NOW() - INTERVAL '${INACTIVITY_PERIOD_MINUTES} minutes'
      AND online = true;
    `);

    // SQL query to update users' online status based on inactivity
    const updateQuery = `
      UPDATE users
      SET online = false
      WHERE last_action < NOW() - INTERVAL '${INACTIVITY_PERIOD_MINUTES} minutes'
      AND online = true;
    `;
    await client.query(updateQuery);

    return NextResponse.json({
      message: `Inactivity check completed. Users inactive for more than ${INACTIVITY_PERIOD_MINUTES} minutes are now offline.`,
      onlineUsers: onlineUsersResult.rows,      // Currently online users before the check
      inactiveUsers: inactiveUsersResult.rows,  // Users marked as inactive
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  } finally {
    client.release();
  }
}
