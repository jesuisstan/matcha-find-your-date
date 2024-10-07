import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { calculateAge } from '@/utils/format-string';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Step 1: Fetch the logged-in user's tags
    const userTagsResult = await client.query(`SELECT tags FROM users WHERE id = $1`, [userId]);

    if (userTagsResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    const userTags = userTagsResult.rows[0].tags || [];

    // Step 2: Fetch users that the current user has blocked but exclude those who also blocked the current user
    const query = `
      SELECT 
        users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
        users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
        users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete, users.photos
      FROM blocked_users
      JOIN users ON blocked_users.blocked_user_id = users.id
      WHERE blocked_users.blocker_id = $1
      AND users.confirmed = true
      AND users.complete = true
      AND users.id NOT IN (
        SELECT blocker_id FROM blocked_users WHERE blocked_user_id = $1
      )
    `;

    const blockedProfilesResult = await client.query(query, [userId]);
    const blockedProfiles = blockedProfilesResult.rows;

    // Step 3: Transform each blocked user to include `age` and `tags_in_common`
    const transformedBlockedUsers = blockedProfiles.map((blockedUser) => {
      const tagsInCommon =
        blockedUser.tags.filter((tag: string) => userTags.includes(tag)).length || 0;
      const age = calculateAge(blockedUser.birthdate);

      return {
        id: blockedUser.id,
        firstname: blockedUser.firstname,
        lastname: blockedUser.lastname,
        nickname: blockedUser.nickname,
        age, // Calculated age from birthdate
        sex: blockedUser.sex,
        biography: blockedUser.biography,
        tags: blockedUser.tags,
        tags_in_common: tagsInCommon, // Calculated tags in common with the current user
        last_action: blockedUser.last_action,
        latitude: blockedUser.latitude,
        longitude: blockedUser.longitude,
        address: blockedUser.address,
        online: blockedUser.online,
        raiting: blockedUser.raiting,
        sex_preferences: blockedUser.sex_preferences,
        confirmed: blockedUser.confirmed,
        complete: blockedUser.complete,
      };
    });

    // Step 4: Update user's last_action and online status
    const currentDate = new Date().toISOString();
    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET last_action = $2, online = true
      WHERE id = $1
      RETURNING id, last_action, online;
    `,
      [userId, currentDate]
    );

    const updatedUser = updatedUserResult.rows[0];

    // Step 5: Return the blocked users and updated user data
    return NextResponse.json({
      blockedProfiles: transformedBlockedUsers,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    return NextResponse.json({ error: 'error-fetching-blocked-users' }, { status: 500 });
  } finally {
    client.release();
  }
}
