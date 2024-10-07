import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { haversineDistance } from '@/utils/server/haversine-distance';

export async function POST(request: Request) {
  const {
    id,
    latitude,
    longitude,
    distance,
    ageMin,
    ageMax,
    flirtFactorMin,
    sex,
    sexPreferences,
    tags,
  } = await request.json();

  const client = await db.connect();

  try {
    // Get the requester-user's data
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    // Update user's last action and set online status to true
    const currentDate = new Date().toISOString();
    const updateQuery = `
      UPDATE users 
      SET last_action = $2, online = true 
      WHERE id = $1
      RETURNING id, last_action, online;
    `;
    const updatedUserResult = await client.query(updateQuery, [id, currentDate]);
    const updatedUserData = updatedUserResult.rows[0];

    if (!updatedUserData) {
      return NextResponse.json({ error: 'failed-to-update-user-activity' }, { status: 500 });
    }

    // todo add photos (delete the line after)
    // todo add "photos" to SELECT on release to fetch photos
    // Prepare the SQL query (EXCLUDE BLOCKED USERS!)
    const queryString = `
      SELECT id, firstname, lastname, nickname, birthdate, sex, sex_preferences, latitude, longitude, tags, raiting, address, biography, last_action, online, confirmed, complete
      FROM users
      WHERE 
        id != $1
        AND sex = $2
        AND sex_preferences = $3
        AND EXTRACT(YEAR FROM AGE(CAST(birthdate AS DATE))) BETWEEN $4 AND $5
        AND raiting >= $6
        AND confirmed = true
        AND complete = true
        AND (
          SELECT count(*) 
          FROM unnest(tags) AS tag 
          WHERE tag = ANY($7)
        ) >= 1
        AND id NOT IN (
          SELECT blocked_user_id FROM blocked_users WHERE blocker_id = $1
        )
        AND id NOT IN (
          SELECT blocker_id FROM blocked_users WHERE blocked_user_id = $1
        )
    `;

    // Execute the query
    const result = await client.query(queryString, [
      id,
      sex,
      sexPreferences,
      ageMin,
      ageMax,
      flirtFactorMin,
      tags,
    ]);
    const users = result.rows;

    // Filter users based on the distance
    const matchingUsers = users.filter((suggestedUser) => {
      if (!suggestedUser.latitude || !suggestedUser.longitude || !latitude || !longitude)
        return false;
      const userDistance = haversineDistance(
        latitude,
        longitude,
        suggestedUser.latitude,
        suggestedUser.longitude
      );
      return userDistance <= distance;
    });

    if (!matchingUsers.length && users.length) {
      return NextResponse.json({ error: 'no-matching-users-on-distance' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'suggestions-retrieved-successfully',
      matchingUsers,
      user: updatedUserData,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'error-fetching-suggestions' }, { status: 500 });
  } finally {
    client.release();
  }
}
