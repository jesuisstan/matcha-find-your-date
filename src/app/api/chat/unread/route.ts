/*
This route retrieves:
1. The total number of unread messages for the logged-in user.
2. A list of users that the logged-in user has already chatted with, along with the count of unread messages from each user.
Route Logic:
- Query the chat table for all unread messages where recipient_id = userId and seen = false to get the total count.
- Retrieve the list of chat partners with unread message counts.
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

    // Query to count total unread messages
    const unreadCountQuery = `
      SELECT COUNT(*) AS unread_count
      FROM chat
      WHERE recipient_id = $1 AND seen = false;
    `;
    const unreadCountResult = await client.query(unreadCountQuery, [userId]);
    const unreadCount = unreadCountResult.rows[0]?.unread_count || 0;

    // Query to get chat partners with unread message counts
    const chatListQuery = `
      SELECT u.id AS chat_partner, u.firstname, u.lastname, u.nickname, u.online, 
             COUNT(c.id) FILTER (WHERE c.seen = false AND c.recipient_id = $1) AS unread_count
      FROM users u
      LEFT JOIN chat c ON (u.id = c.sender_id OR u.id = c.recipient_id)
      WHERE (c.sender_id = $1 OR c.recipient_id = $1) AND u.id != $1
      GROUP BY u.id;
    `;
    const chatListResult = await client.query(chatListQuery, [userId]);
    const chatList = chatListResult.rows;

    return NextResponse.json({
      message: 'chat-info-retrieved',
      unreadCount,
      chatList,
    });
  } catch (error) {
    console.error('Error retrieving chat information:', error);
    return NextResponse.json({ error: 'failed-to-retrieve-all-chats-updates' }, { status: 500 });
  } finally {
    client.release();
  }
}
