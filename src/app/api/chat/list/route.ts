/*
This route retrieves a list of users that the logged-in user has already chatted with. It will also return the count of unread messages from each user.
Route Logic:
- Query the chat table to find distinct recipient_id and sender_id where the logged-in user is either the sender or recipient.
- For each chat, count how many unread messages (seen = false) exist for the current user.
- Return a list of users, each with a count of unread messages.
*/
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Get distinct users the logged-in user has chatted with, and also retrieve firstname, lastname, nickname
    const chatListQuery = `
      SELECT
        CASE
          WHEN sender_id = $1 THEN recipient_id
          WHEN recipient_id = $1 THEN sender_id
        END AS chat_partner,
        users.firstname,
        users.lastname,
        users.nickname,
        COUNT(*) FILTER (WHERE seen = false AND recipient_id = $1) AS unread_count
      FROM chat
      JOIN users ON users.id = CASE
        WHEN sender_id = $1 THEN recipient_id
        WHEN recipient_id = $1 THEN sender_id
      END
      WHERE sender_id = $1 OR recipient_id = $1
      GROUP BY chat_partner, users.firstname, users.lastname, users.nickname;
    `;

    const result = await client.query(chatListQuery, [userId]);
    const chatList = result.rows;

    return NextResponse.json({ message: 'chat-list-retrieved', chatList });
  } catch (error) {
    console.error('Error retrieving chat list:', error);
    return NextResponse.json({ error: 'failed-to-retrieve-chat-list' }, { status: 500 });
  } finally {
    client.release();
  }
}
