import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { visitorId, visitedUserId } = body;

    // Step 1: Validate input
    if (!visitorId || !visitedUserId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Prevent users from logging visits to their own profile
    if (visitorId === visitedUserId) {
      return NextResponse.json({ message: 'cannot-visit-own-profile' });
    }

    // Step 3: Check if either user has blocked the other
    const blockCheck = await client.query(
      `
      SELECT 1 FROM blocked_users
      WHERE (blocker_id = $1 AND blocked_user_id = $2)
      OR (blocker_id = $2 AND blocked_user_id = $1)
      LIMIT 1;
      `,
      [visitorId, visitedUserId]
    );

    // Step 4: If either user blocked the other, return 204 (No Content)
    if (blockCheck?.rowCount && blockCheck.rowCount > 0) {
      return new NextResponse(null, { status: 204 });
    }

    // Step 5: Log the visit (update the visit time if it already exists)
    await client.query(
      `
      INSERT INTO visits (visitor_id, visited_user_id, visit_time)
      VALUES ($1, $2, NOW())
      ON CONFLICT (visitor_id, visited_user_id)
      DO UPDATE SET visit_time = EXCLUDED.visit_time;
    `,
      [visitorId, visitedUserId]
    );

    // Step 6: Check if a notification was recently sent (in the last 42 minutes)
    const recentNotificationCheck = await client.query(
      `
      SELECT 1
      FROM notifications
      WHERE user_id = $1
      AND from_user_id = $2
      AND type = 'visit'
      AND notification_time > NOW() - INTERVAL '42 minutes'
      LIMIT 1;
    `,
      [visitedUserId, visitorId]
    );

    // Step 7: Add a notification if no recent notification exists
    if (recentNotificationCheck.rowCount === 0) {
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time)
        VALUES ($1, 'visit', $2, NOW());
      `,
        [visitedUserId, visitorId]
      );
    }

    // Step 8: Update the online status and last action of the visitor
    const currentDate = new Date().toISOString();
    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [visitorId, currentDate]
    );

    const updatedUser = updatedUserResult.rows[0];

    // Return the updated user to the frontend
    return NextResponse.json({
      message: 'visit-logged-successfully',
      user: { ...updatedUser },
    });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ error: 'visit-logging-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
