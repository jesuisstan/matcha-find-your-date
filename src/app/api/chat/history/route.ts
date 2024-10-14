/*
This route retrieves the full chat history between the logged-in user and another user (when the user clicks on a chat). It also marks all unread messages from the other user as read.
Route Logic:
- Fetch all messages between the logged-in user and the selected user.
- Update the seen status of unread messages (set seen = true for those sent by the other user).
*/

import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, chatPartnerId } = body;

    if (!userId || !chatPartnerId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Fetch the chat history between the two users
    const chatHistoryQuery = `
      SELECT * FROM chat
      WHERE (sender_id = $1 AND recipient_id = $2)
      OR (sender_id = $2 AND recipient_id = $1)
      ORDER BY created_at ASC;
    `;

    const chatHistoryResult = await client.query(chatHistoryQuery, [userId, chatPartnerId]);

    // Mark all unread messages from the chatPartner as read
    await client.query(
      `
      UPDATE chat
      SET seen = true
      WHERE sender_id = $1 AND recipient_id = $2 AND seen = false;
    `,
      [chatPartnerId, userId]
    );

    return NextResponse.json({
      message: 'chat-history-retrieved',
      chatHistory: chatHistoryResult.rows,
    });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return NextResponse.json({ error: 'failed-to-retrieve-chat-history' }, { status: 500 });
  } finally {
    client.release();
  }
}
