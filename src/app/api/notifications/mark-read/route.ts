import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();
  try {
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Update the notification to mark it as viewed
    await client.query(
      `
      UPDATE notifications 
      SET viewed = true 
      WHERE id = $1;
      `,
      [notificationId]
    );

    return NextResponse.json({ message: 'notification-marked-as-read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'failed-mark-notification-read' }, { status: 500 });
  } finally {
    client.release();
  }
}
