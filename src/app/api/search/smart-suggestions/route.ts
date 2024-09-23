import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { haversineDistance } from '@/utils/server/haversine-distance';

export async function POST(request: Request) {
  const { userId } = await request.json();
  let maxDistance = 42; // Max distance in km for the first iteration
  const MAX_DISTANCE_LIMIT = 10000; // Max distance in km for the last iteration
  const MIN_USERS_COUNT = 3; // Min number of users to return
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

    // Extract necessary data from user
    const {
      latitude,
      longitude,
      sex,
      sex_preferences: sexPreferences,
      tags: userTags,
      raiting: userRaiting,
    } = user;

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

    // Query to select matching users based on tags intersection and rating
    const queryString = `
      SELECT 
        id, firstname, lastname, nickname, birthdate, sex, sex_preferences, latitude, longitude, tags, raiting, photos, address, biography, last_action, online, confirmed, complete
      FROM users
      WHERE 
        id != $1
        AND ${sexFilter}
        AND raiting >= $2
        AND (
          SELECT count(*) 
          FROM unnest(tags) AS tag 
          WHERE tag = ANY($3)
        ) >= 1
    `;

    const result = await client.query(queryString, [userId, userRaiting, userTags]);
    const users = result.rows;

    let matchingUsers = [];

    // Filter users by distance
    while (matchingUsers.length < MIN_USERS_COUNT && maxDistance <= MAX_DISTANCE_LIMIT) {
      // Limiit the distance to MAX_DISTANCE_LIMIT km
      matchingUsers = users.filter((suggestedUser) => {
        if (!suggestedUser.latitude || !suggestedUser.longitude) return false;
        const userDistance = haversineDistance(
          latitude,
          longitude,
          suggestedUser.latitude,
          suggestedUser.longitude
        );
        return userDistance <= maxDistance;
      });

      // If no users found, double the distance and try again
      if (matchingUsers.length < MIN_USERS_COUNT) {
        maxDistance *= 2;
      }
    }

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
