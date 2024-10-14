/*
This route checks if a chat exists between two users, and if not, it creates an empty chat.
Route Logic:
- Check if there's already a chat (match) between the two users.
- If no match exists, return an error (403).
- If a chat doesn't exist between the users, create a new entry in the chat table.
*/

import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, partnerId } = body;

    if (!userId || !partnerId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 1: Check if the users have a match (to confirm they are allowed to chat)
    const matchCheckResult = await client.query(
      `
      SELECT id FROM matches 
      WHERE (user_one_id = $1 AND user_two_id = $2) 
         OR (user_one_id = $2 AND user_two_id = $1)
      LIMIT 1;
    `,
      [userId, partnerId]
    );

    if (matchCheckResult.rowCount === 0) {
      return NextResponse.json({ error: 'match-not-found' }, { status: 403 });
    }

    // Step 2: Check if a chat already exists
    const chatExistsResult = await client.query(
      `
      SELECT 1 FROM chat
      WHERE (sender_id = $1 AND recipient_id = $2) 
         OR (sender_id = $2 AND recipient_id = $1)
      LIMIT 1;
    `,
      [userId, partnerId]
    );

    if (chatExistsResult.rowCount === 0) {
      // Step 3: If no chat exists, create an empty chat
      await client.query(
        `
        INSERT INTO chat (match_id, sender_id, recipient_id, message, created_at, seen)
        VALUES ($1, $2, $3, '', NOW(), true);
      `,
        [matchCheckResult.rows[0].id, userId, partnerId]
      );
    }

    return NextResponse.json({ message: 'chat-initiated-successfully' });
  } catch (error) {
    console.error('Error initiating chat:', error);
    return NextResponse.json({ error: 'failed-to-initiate-chat' }, { status: 500 });
  } finally {
    client.release();
  }
}
