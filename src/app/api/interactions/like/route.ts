import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { likerId, likedUserId, likeAction } = body; // 'like' | 'unlike'

    // Step 1: Validate input
    if (!likerId || !likedUserId || !likeAction) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Prevent users from liking themselves
    if (likerId === likedUserId) {
      return NextResponse.json({ message: 'cannot-like-own-profile' });
    }

    if (likeAction === 'like') {
      // Insert a like
      await client.query(
        `
        INSERT INTO likes (liker_id, liked_user_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (liker_id, liked_user_id) DO NOTHING;
      `,
        [likerId, likedUserId]
      );

      // Increment rating for both users (max 100)
      await client.query(
        `
        UPDATE users
        SET rating = LEAST(rating + 1, 100)
        WHERE id = $1 OR id = $2;
      `,
        [likerId, likedUserId]
      );

      // Fetch the updated ratings
      const likerRatingResult = await client.query(`SELECT rating FROM users WHERE id = $1`, [
        likerId,
      ]);
      const likedUserRatingResult = await client.query(`SELECT rating FROM users WHERE id = $1`, [
        likedUserId,
      ]);

      const likerRating = likerRatingResult.rows[0].rating;
      const likedUserRating = likedUserRatingResult.rows[0].rating;

      // Add a notification for the liked user about the like with updated ratings
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time, liker_rating, liked_user_rating)
        VALUES ($1, 'like', $2, NOW(), $3, $4);
      `,
        [likedUserId, likerId, likerRating, likedUserRating]
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
          INSERT INTO matches (user_one_id, user_two_id, created_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user_one_id, user_two_id) DO NOTHING;
        `,
          [likerId, likedUserId]
        );

        // Add notifications for both users about the match with updated ratings
        await client.query(
          `
          INSERT INTO notifications (user_id, type, from_user_id, notification_time, liker_rating, liked_user_rating)
          VALUES ($1, 'match', $2, NOW(), $3, $4), 
                 ($2, 'match', $1, NOW(), $4, $3);
        `,
          [likerId, likedUserId, likerRating, likedUserRating]
        );
      }
    } else if (likeAction === 'unlike') {
      // Unlike case: Remove the like
      await client.query(
        `
        DELETE FROM likes
        WHERE liker_id = $1 AND liked_user_id = $2;
      `,
        [likerId, likedUserId]
      );

      // Decrement rating for both users (min 0)
      await client.query(
        `
        UPDATE users
        SET rating = GREATEST(rating - 1, 0)
        WHERE id = $1 OR id = $2;
      `,
        [likerId, likedUserId]
      );

      // Fetch the updated ratings after unlike
      const likerRatingResult = await client.query(`SELECT rating FROM users WHERE id = $1`, [
        likerId,
      ]);
      const likedUserRatingResult = await client.query(`SELECT rating FROM users WHERE id = $1`, [
        likedUserId,
      ]);

      const likerRating = likerRatingResult.rows[0].rating;
      const likedUserRating = likedUserRatingResult.rows[0].rating;

      // Notify the liked user about the unlike with updated ratings
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time, liker_rating, liked_user_rating)
        VALUES ($1, 'unlike', $2, NOW(), $3, $4);
      `,
        [likedUserId, likerId, likerRating, likedUserRating]
      );

      // Check if this action breaks a match
      const matchCheck = await client.query(
        `
        SELECT 1 FROM matches
        WHERE (user_one_id = $1 AND user_two_id = $2) OR (user_one_id = $2 AND user_two_id = $1);
      `,
        [likerId, likedUserId]
      );

      // If there was a match, remove it and notify the other user
      if (matchCheck?.rowCount && matchCheck.rowCount > 0) {
        await client.query(
          `
          DELETE FROM matches
          WHERE (user_one_id = $1 AND user_two_id = $2) OR (user_one_id = $2 AND user_two_id = $1);
        `,
          [likerId, likedUserId]
        );

        // Notify both users about the unmatch with updated ratings
        await client.query(
          `
          INSERT INTO notifications (user_id, type, from_user_id, notification_time, liker_rating, liked_user_rating)
          VALUES ($1, 'unmatch', $2, NOW(), $3, $4);
        `,
          [likedUserId, likerId, likerRating, likedUserRating]
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
      RETURNING id, last_action, online, rating;
    `,
      [likerId, currentDate]
    );

    const likedUserUpdatedResult = await client.query(
      `SELECT id, rating FROM users WHERE id = $1;`,
      [likedUserId]
    );

    const updatedUser = updatedUserResult.rows[0];
    const likedUserUpdated = likedUserUpdatedResult.rows[0];

    return NextResponse.json({
      message: likeAction === 'like' ? 'like-logged-successfully' : 'unlike-logged-successfully',
      user: { ...updatedUser },
      likedUser: { ...likedUserUpdated },
    });
  } catch (error) {
    console.error('Error logging like/unlike:', error);
    return NextResponse.json({ error: 'like-logging-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
