import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const { notificationId } = await req.json();
  const client = await db.connect();

  try {
    await client.query(`UPDATE notifications SET viewed = true WHERE id = $1`, [notificationId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'failed-mark-notification-read' }, { status: 500 });
  } finally {
    client.release();
  }
}
