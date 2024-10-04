import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { likerId, likedUserId } = body;

    // Step 1: Validate input
    if (!likerId || !likedUserId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Check if the liker already liked the likedUserId
    const existingLike = await client.query(
      `
      SELECT 1
      FROM likes
      WHERE liker_id = $1
      AND liked_user_id = $2
    `,
      [likerId, likedUserId]
    );

    // Assert that rowCount is not null (non-null assertion)
    if (existingLike.rowCount! > 0) {
      return NextResponse.json({ message: 'already-liked' });
    }

    // Step 3: Add the like to the likes table
    await client.query(
      `
      INSERT INTO likes (liker_id, liked_user_id, like_time)
      VALUES ($1, $2, NOW());
    `,
      [likerId, likedUserId]
    );

    // Step 4: Notify the liked user about the like
    await client.query(
      `
      INSERT INTO notifications (user_id, type, from_user_id, notification_time)
      VALUES ($1, 'like', $2, NOW());
    `,
      [likedUserId, likerId]
    );

    // Step 5: Check if there is a match (i.e., the likedUser already liked the liker)
    const existingMatch = await client.query(
      `
      SELECT 1
      FROM likes
      WHERE liker_id = $1
      AND liked_user_id = $2
    `,
      [likedUserId, likerId]
    );

    let match = false;

    if (existingMatch.rowCount! > 0) {
      // Step 6: If there's a match, add the match to the matches table
      await client.query(
        `
        INSERT INTO matches (user1_id, user2_id, match_time)
        VALUES ($1, $2, NOW());
      `,
        [likerId, likedUserId]
      );

      // Notify both users about the match
      await client.query(
        `
        INSERT INTO notifications (user_id, type, from_user_id, notification_time)
        VALUES ($1, 'match', $2, NOW()),
               ($2, 'match', $1, NOW());
      `,
        [likerId, likedUserId]
      );

      match = true;
    }

    // Step 7: Update the raiting of both users (+1, capped at 100)
    await client.query(
      `
      UPDATE users
      SET raiting = LEAST(raiting + 1, 100)
      WHERE id = $1 OR id = $2;
    `,
      [likerId, likedUserId]
    );

    // Step 8: Update the online status and last action of the liker
    const currentDate = new Date().toISOString();
    const updatedLikerResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [likerId, currentDate]
    );

    const updatedLiker = updatedLikerResult.rows[0];

    return NextResponse.json({
      message: match ? 'match-success' : 'like-success',
      user: { ...updatedLiker },
    });
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json({ error: 'like-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
