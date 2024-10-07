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

    // Step 2: Fetch mutual matches (users that have liked each other)
    // todo add photos (delete the line after)
    const query = `
      SELECT 
        users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
        users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
        users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete
      FROM matches
      JOIN users ON (matches.user_one_id = users.id OR matches.user_two_id = users.id)
      WHERE (matches.user_one_id = $1 OR matches.user_two_id = $1)
      AND users.id != $1
      AND users.confirmed = true
      AND users.complete = true
    `;

    const matchesResult = await client.query(query, [userId]);
    const matches = matchesResult.rows;

    // Step 3: Transform each match to include `age` and `tags_in_common`
    const transformedMatches = matches.map((match) => {
      const tagsInCommon = match.tags.filter((tag: string) => userTags.includes(tag)).length || 0;
      const age = calculateAge(match.birthdate);

      return {
        id: match.id,
        firstname: match.firstname,
        lastname: match.lastname,
        nickname: match.nickname,
        age, // Calculated age from birthdate
        sex: match.sex,
        biography: match.biography,
        tags: match.tags,
        tags_in_common: tagsInCommon, // Calculated tags in common with the current user
        last_action: match.last_action,
        latitude: match.latitude,
        longitude: match.longitude,
        address: match.address,
        online: match.online,
        raiting: match.raiting,
        sex_preferences: match.sex_preferences,
        confirmed: match.confirmed,
        complete: match.complete,
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

    // Step 5: Return the matches and updated user data
    return NextResponse.json({
      matches: transformedMatches,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'error-fetching-matches' }, { status: 500 });
  } finally {
    client.release();
  }
}
