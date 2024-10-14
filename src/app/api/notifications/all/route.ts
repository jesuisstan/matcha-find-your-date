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

    // Fetch all notifications for the user
    const query = `
      SELECT 
        notifications.id, notifications.type, notifications.notification_time, 
        notifications.viewed, notifications.from_user_id, 
        users.firstname, users.lastname, users.nickname,
        notifications.liker_rating, notifications.liked_user_rating
      FROM notifications
      JOIN users ON notifications.from_user_id = users.id
      WHERE notifications.user_id = $1
      ORDER BY notifications.notification_time DESC
    `;

    const notificationsResult = await client.query(query, [userId]);
    const notifications = notificationsResult.rows;

    // Return notifications
    return NextResponse.json({
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'error-fetching-notifications' }, { status: 500 });
  } finally {
    client.release();
  }
}
