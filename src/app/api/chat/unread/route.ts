/*
This route retrieves the total number of unread messages for the logged-in user from all users. This is useful for showing a global unread message count in a notification icon.
Route Logic:
- Query the chat table for all unread messages where recipient_id = userId and seen = false.
- Return the total count.
*/
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Query to count unread messages
    const unreadCountQuery = `
      SELECT COUNT(*) AS unread_count
      FROM chat
      WHERE recipient_id = $1 AND seen = false;
    `;

    const result = await client.query(unreadCountQuery, [userId]);
    const unreadCount = result.rows[0]?.unread_count || 0;

    return NextResponse.json({ message: 'unread-count-retrieved', unreadCount });
  } catch (error) {
    console.error('Error retrieving unread message count:', error);
    return NextResponse.json({ error: 'failed-to-retrieve-unread-count' }, { status: 500 });
  } finally {
    client.release();
  }
}
