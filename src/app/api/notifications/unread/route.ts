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

    // Fetch only unread notifications for the user
    const query = `
      SELECT 
        notifications.id, notifications.type, notifications.notification_time, 
        notifications.viewed, notifications.from_user_id, 
        users.firstname, users.lastname, users.nickname,
        notifications.liker_rating, notifications.liked_user_rating
      FROM notifications
      JOIN users ON notifications.from_user_id = users.id
      WHERE notifications.user_id = $1
      AND notifications.viewed = false
      ORDER BY notifications.notification_time DESC
    `;

    const unreadNotificationsResult = await client.query(query, [userId]);
    const unreadNotifications = unreadNotificationsResult.rows;

    // Return unread notifications
    return NextResponse.json({
      unreadNotifications,
    });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return NextResponse.json({ error: 'error-fetching-unread-notifications' }, { status: 500 });
  } finally {
    client.release();
  }
}
