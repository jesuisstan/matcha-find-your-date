/*
This route allows users to send a message to another user. It stores the message in the chat table.
Route Logic:
- Insert a new row into the chat table with the message details.
- If the logged-in user's last_action is more than a minute ago, update it.
*/
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { senderId, recipientId, message } = body;

    if (!senderId || !recipientId || !message) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 0: Check if message is between 1 and 442 characters 
    if (message.length < 1 || message.length > 442) {
      return NextResponse.json({ error: 'invalid-message-length' }, { status: 400 });
    }

    // Step 1: Check if the users have a match
    const matchCheckResult = await client.query(
      `
      SELECT id FROM matches 
      WHERE (user_one_id = $1 AND user_two_id = $2) 
         OR (user_one_id = $2 AND user_two_id = $1)
      LIMIT 1;
    `,
      [senderId, recipientId]
    );

    if (matchCheckResult.rowCount === 0) {
      return NextResponse.json({ error: 'match-not-found' }, { status: 403 });
    }

    // Step 2: Check if either user has blocked the other
    const blockCheckResult = await client.query(
      `
      SELECT 1 FROM blocked_users
      WHERE (blocker_id = $1 AND blocked_user_id = $2)
         OR (blocker_id = $2 AND blocked_user_id = $1)
      LIMIT 1;
    `,
      [senderId, recipientId]
    );

    // Explicitly checking if rowCount is greater than 0
    if ((blockCheckResult?.rowCount ?? 0) > 0) {
      return NextResponse.json({ error: 'user-blocked' }, { status: 403 });
    }

    // Step 3: Insert the message into the chat table
    await client.query(
      `
      INSERT INTO chat (match_id, sender_id, recipient_id, message, created_at)
      VALUES ($1, $2, $3, $4, NOW());
    `,
      [matchCheckResult.rows[0].id, senderId, recipientId, message]
    );

    // Step 4: Update user's last_action if more than 1 minute ago
    await client.query(
      `
      UPDATE users
      SET last_action = NOW(), online = true
      WHERE id = $1 AND last_action < NOW() - INTERVAL '1 minute';
    `,
      [senderId]
    );

    return NextResponse.json({ message: 'message-sent-successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'failed-to-send-message' }, { status: 500 });
  } finally {
    client.release();
  }
}
