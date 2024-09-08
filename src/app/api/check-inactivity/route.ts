import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

// the inactivity period (e.g., 10 minutes)
const INACTIVITY_PERIOD_MINUTES = 1; // todo change to 10

export async function GET() {
  const client = await db.connect();
  console.log('Connected to DB');

  try {
    // Log before executing query
    console.log('Checking for users inactive for more than 10 minutes...');

    const result = await client.query(
      `UPDATE users SET online = false WHERE online = true AND last_action < NOW() - INTERVAL '${INACTIVITY_PERIOD_MINUTES} minutes' RETURNING id, online`
    );

    // Log the result of the query
    console.log('Users set to offline:', result.rows);

    return new Response(
      `Inactivity check completed. Users inactive for more than ${INACTIVITY_PERIOD_MINUTES} minutes are now offline.`,
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    console.error('Error in inactivity check:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  } finally {
    client.release();
  }
}
