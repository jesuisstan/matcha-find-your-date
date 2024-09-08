import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

// the inactivity period (e.g., 10 minutes)
const INACTIVITY_PERIOD_MINUTES = 1; // todo change to 10

export async function GET() {
  const client = await db.connect();

  try {
    const result = await client.query(`SELECT * FROM users WHERE online = true`); // debug

    // SQL query to update users' online status based on inactivity
    const updateQuery = `
      UPDATE users
      SET online = false
      WHERE last_action < NOW() - INTERVAL '${INACTIVITY_PERIOD_MINUTES} minutes'
      AND online = true;
    `;

    await client.query(updateQuery);

    return NextResponse.json({
      message: `Inactivity check completed. Users (${JSON.stringify(result, null, 2)}) inactive for more than ${INACTIVITY_PERIOD_MINUTES} minutes are now offline.`,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  } finally {
    client.release();
  }
}