import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { blockerId, blockedUserId, blockAction } = body; // 'block' | 'unblock'

    // Validate input
    if (!blockerId || !blockedUserId || !blockAction) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Prevent users from blocking/unblocking themselves
    if (blockerId === blockedUserId) {
      return NextResponse.json({ message: 'cannot-block-own-profile' });
    }

    // Check if the user is already blocked
    if (blockAction === 'block') {
      const blockCheck = await client.query(
        `
        SELECT 1 FROM blocked_users
        WHERE blocker_id = $1 AND blocked_user_id = $2;
      `,
        [blockerId, blockedUserId]
      );

      if (blockCheck?.rowCount && blockCheck.rowCount > 0) {
        // User is already blocked, return a message without further processing
        const currentDate = new Date().toISOString();
        const updatedUserResult = await client.query(
          `
          UPDATE users
          SET last_action = $2, online = true
          WHERE id = $1
          RETURNING id, last_action, online;
        `,
          [blockerId, currentDate]
        );

        const updatedUser = updatedUserResult.rows[0];

        return NextResponse.json({
          message: 'user-is-already-blocked',
          user: { ...updatedUser },
        });
      }

      // Block the user
      await client.query(
        `
        INSERT INTO blocked_users (blocker_id, blocked_user_id, blocked_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (blocker_id, blocked_user_id) DO NOTHING;
      `,
        [blockerId, blockedUserId]
      );

      // Remove any existing likes between the two users
      await client.query(
        `
        DELETE FROM likes
        WHERE (liker_id = $1 AND liked_user_id = $2) OR (liker_id = $2 AND liked_user_id = $1);
      `,
        [blockerId, blockedUserId]
      );

      // Remove visits between the two users (both directions)
      await client.query(
        `
        DELETE FROM visits
        WHERE (visitor_id = $1 AND visited_user_id = $2) OR (visitor_id = $2 AND visited_user_id = $1);
      `,
        [blockerId, blockedUserId]
      );

      // Check if a match exists between the two users
      const matchCheck = await client.query(
        `
        SELECT 1 FROM matches
        WHERE (user_one_id = $1 AND user_two_id = $2) OR (user_one_id = $2 AND user_two_id = $1);
      `,
        [blockerId, blockedUserId]
      );

      // If a match exists, remove it and notify the other user
      if (matchCheck?.rowCount && matchCheck.rowCount > 0) {
        // Delete the match
        await client.query(
          `
          DELETE FROM matches
          WHERE (user_one_id = $1 AND user_two_id = $2) OR (user_one_id = $2 AND user_two_id = $1);
        `,
          [blockerId, blockedUserId]
        );

        // Add an unmatch notification
        await client.query(
          `
          INSERT INTO notifications (user_id, type, from_user_id, notification_time)
          VALUES ($1, 'unmatch', $2, NOW());
        `,
          [blockedUserId, blockerId]
        );
      }

      // Add a block notification for the blocked user
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time)
        VALUES ($1, 'block', $2, NOW());
      `,
        [blockedUserId, blockerId]
      );
    } else if (blockAction === 'unblock') {
      // Unblock the user
      await client.query(
        `
        DELETE FROM blocked_users
        WHERE blocker_id = $1 AND blocked_user_id = $2;
      `,
        [blockerId, blockedUserId]
      );

      // Add an unblock notification for the unblocked user
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time)
        VALUES ($1, 'unblock', $2, NOW());
      `,
        [blockedUserId, blockerId]
      );
    }

    // Update the blocker's online status and last action
    const currentDate = new Date().toISOString();
    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [blockerId, currentDate]
    );

    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      message:
        blockAction === 'block' ? 'user-blocked-successfully' : 'user-unblocked-successfully',
      user: { ...updatedUser },
    });
  } catch (error) {
    console.error('Error processing block/unblock:', error);
    return NextResponse.json({ error: 'block-processing-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
