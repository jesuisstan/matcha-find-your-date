import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, profileToCheckId } = body;

    if (!userId || !profileToCheckId) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // 1. Check if the user has liked the profile
    const likeCheck = await client.query(
      `
      SELECT 1
      FROM likes
      WHERE liker_id = $1 AND liked_user_id = $2
      `,
      [userId, profileToCheckId]
    );
    const isLiked = likeCheck && likeCheck.rowCount ? likeCheck.rowCount > 0 : false;

    // 2. Check if the user is matched with the profile
    const matchCheck = await client.query(
      `
      SELECT 1
      FROM matches
      WHERE (user_one_id = $1 AND user_two_id = $2)
      OR (user_one_id = $2 AND user_two_id = $1)
      `,
      [userId, profileToCheckId]
    );
    const isMatch = matchCheck && matchCheck.rowCount ? matchCheck.rowCount > 0 : false;

    // 3. Check if the user has blocked the profile
    const blockCheck = await client.query(
      `
      SELECT 1
      FROM blocked_users
      WHERE blocker_id = $1 AND blocked_user_id = $2
      `,
      [userId, profileToCheckId]
    );
    const isBlocked = blockCheck && blockCheck.rowCount ? blockCheck.rowCount > 0 : false;

    // 4. Check if the user has been blocked by the profile
    const blockedByCheck = await client.query(
      `
      SELECT 1
      FROM blocked_users
      WHERE blocker_id = $2 AND blocked_user_id = $1
      `,
      [userId, profileToCheckId]
    );
    const isBlockedBy =
      blockedByCheck && blockedByCheck.rowCount ? blockedByCheck.rowCount > 0 : false;

    return NextResponse.json({
      isLiked,
      isMatch,
      isBlocked,
      isBlockedBy,
    });
  } catch (error) {
    console.error('Error checking profile:', error);
    return NextResponse.json({ error: 'profile-check-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
