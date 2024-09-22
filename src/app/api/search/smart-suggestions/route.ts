import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { haversineDistance } from '@/utils/server/haversine-distance';

export async function POST(request: Request) {
  const { userId, latitude, longitude, sex, sexPreferences, tags } = await request.json();
  const maxDistance = 42; // Max distance in km
  const client = await db.connect();

  try {
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
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
    const updatedUserResult = await client.query(updateQuery, [userId, currentDate]);
    const updatedUserData = updatedUserResult.rows[0];

    if (!updatedUserData) {
      return NextResponse.json({ error: 'failed-to-update-user-activity' }, { status: 500 });
    }

    // Filter users by sex & sex-preferences
    let sexFilter: string = '';
    if (sexPreferences === 'men') {
      if (sex === 'male') {
        sexFilter = `(sex = 'male' AND sex_preferences IN ('men', 'bisexual'))`;
      } else {
        sexFilter = `(sex = 'male' AND sex_preferences IN ('women', 'bisexual'))`;
      }
    } else if (sexPreferences === 'women') {
      if (sex == 'male') {
        sexFilter = `(sex = 'female' AND sex_preferences IN ('men', 'bisexual'))`;
      } else {
        sexFilter = `(sex = 'female' AND sex_preferences IN ('women', 'bisexual'))`;
      }
    } else if (sexPreferences === 'bisexual') {
      if (sex === 'male') {
        sexFilter = `(sex = 'female' AND sex_preferences IN ('men', 'bisexual')) OR (sex = 'male' AND sex_preferences = 'bisexual') OR (sex = 'male' AND sex_preferences = 'men')`;
      } else if (sex === 'female') {
        sexFilter = `(sex = 'male' AND sex_preferences IN ('women', 'bisexual')) OR (sex = 'female' AND sex_preferences = 'bisexual') OR (sex = 'female' AND sex_preferences = 'women')`;
      }
    }

    // Filter users by tags & sort by tags count & raiting
    const queryString = `
      SELECT 
        id, firstname, lastname, nickname, birthdate, sex, sex_preferences, latitude, longitude, tags, raiting, photos, address, biography, last_action, online, confirmed, complete
      FROM users
      WHERE 
        id != $1
        AND ${sexFilter}
      ORDER BY (
        SELECT count(*) 
        FROM unnest(tags) AS tag 
        WHERE tag = ANY($2)
      ) DESC, raiting DESC;
    `;

    const result = await client.query(queryString, [userId, tags]);
    const users = result.rows;

    // Filter users by distance
    const matchingUsers = users.filter((suggestedUser) => {
      if (!suggestedUser.latitude || !suggestedUser.longitude) return false;
      const userDistance = haversineDistance(
        latitude,
        longitude,
        suggestedUser.latitude,
        suggestedUser.longitude
      );
      return userDistance <= maxDistance;
    });

    return NextResponse.json({
      message: 'suggestions-retrieved-successfully',
      matchingUsers,
      updatedUserData,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'error-fetching-suggestions' }, { status: 500 });
  } finally {
    client.release();
  }
}
