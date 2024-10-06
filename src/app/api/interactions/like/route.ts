import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { likerId, likedUserId, likeAction } = body; // 'likeAction' will be true for like, false for unlike

    // Step 1: Validate input
    if (!likerId || !likedUserId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Prevent users from liking themselves
    if (likerId === likedUserId) {
      return NextResponse.json({ message: 'cannot-like-own-profile' });
    }

    if (likeAction) {
      // Insert a like
      await client.query(
        `
        INSERT INTO likes (liker_id, liked_user_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (liker_id, liked_user_id) DO NOTHING;
      `,
        [likerId, likedUserId]
      );

      // Check if the liked user already liked the liker
      const mutualLikeCheck = await client.query(
        `
        SELECT 1 FROM likes
        WHERE liker_id = $1 AND liked_user_id = $2;
      `,
        [likedUserId, likerId]
      );

      // If both users liked each other, create a match
      if (mutualLikeCheck?.rowCount && mutualLikeCheck.rowCount > 0) {
        await client.query(
          `
          INSERT INTO matches (user1_id, user2_id, match_time)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user1_id, user2_id) DO NOTHING;
        `,
          [likerId, likedUserId]
        );

        // Add notifications for both users about the match
        await client.query(
          `
          INSERT INTO notifications (user_id, type, from_user_id, notification_time)
          VALUES ($1, 'match', $2, NOW()), ($2, 'match', $1, NOW());
        `,
          [likerId, likedUserId]
        );
      }

      // Add a notification for the liked user about the like
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time)
        VALUES ($1, 'like', $2, NOW());
      `,
        [likedUserId, likerId]
      );
    } else {
      // Unlike case: Remove the like
      await client.query(
        `
        DELETE FROM likes
        WHERE liker_id = $1 AND liked_user_id = $2;
      `,
        [likerId, likedUserId]
      );

      // Check if this action breaks a match
      const matchCheck = await client.query(
        `
        SELECT 1 FROM matches
        WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1);
      `,
        [likerId, likedUserId]
      );

      // If there was a match, remove it and notify the other user
      if (matchCheck?.rowCount && matchCheck.rowCount > 0) {
        await client.query(
          `
          DELETE FROM matches
          WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1);
        `,
          [likerId, likedUserId]
        );

        // Notify the liked user that the match has been removed
        await client.query(
          `
          INSERT INTO notifications (user_id, type, from_user_id, notification_time)
          VALUES ($1, 'unmatch', $2, NOW());
        `,
          [likedUserId, likerId]
        );
      }
    }

    // Step 4: Update the liker’s online status and last action
    const currentDate = new Date().toISOString();
    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [likerId, currentDate]
    );

    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      message: likeAction ? 'like-logged-successfully' : 'unlike-logged-successfully',
      user: { ...updatedUser },
    });
  } catch (error) {
    console.error('Error logging like/unlike:', error);
    return NextResponse.json({ error: 'like-logging-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
