import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { haversineDistance } from '@/utils/server/haversine-distance';

export async function POST(request: Request) {
  const {
    id,
    distance,
    ageMin,
    ageMax,
    flirtFactorMin,
    tags,
    sex,
    sexPreferences,
    latitude,
    longitude,
    address,
  } = await request.json();

  const client = await db.connect();

  try {
    const queryFilters = [];
    const queryValues: any[] = [];

    // Filter users by sex
    if (sex) {
      queryFilters.push('sex = $1');
      queryValues.push(sex);
    }

    // Filter users by sex preferences
    if (sexPreferences) {
      queryFilters.push('sex_preferences = $2');
      queryValues.push(sexPreferences);
    }

    // Filter users by age, converting birthdate (TEXT) to DATE and calculating the age
    if (ageMin && ageMax) {
      queryFilters.push(
        "EXTRACT(YEAR FROM AGE(TO_DATE(birthdate, 'YYYY-MM-DD'))) BETWEEN $3 AND $4"
      );
      queryValues.push(ageMin, ageMax);
    }

    // Filter users by tags (matching at least one tag)
    if (tags && tags.length > 0) {
      queryFilters.push(`tags && $5`);
      queryValues.push(tags);
    }

    // Filter users by minimum rating
    if (flirtFactorMin) {
      queryFilters.push(`raiting >= $6`);
      queryValues.push(flirtFactorMin);
    }

    // Prepare the SQL query
    const queryString = `
      SELECT id, email, firstname, lastname, nickname, birthdate, sex, sex_preferences, latitude, longitude, tags, raiting, photos, address
      FROM users
      WHERE ${queryFilters.length > 0 ? queryFilters.join(' AND ') : 'TRUE'}
    `;

    // Execute the query
    const result = await client.query(queryString, queryValues);
    const users = result.rows;

    // Filter users based on the distance
    const matchingUsers = users.filter((user) => {
      if (!user.latitude || !user.longitude || !latitude || !longitude) return false;
      const userDistance = haversineDistance(latitude, longitude, user.latitude, user.longitude);
      return userDistance <= distance;
    });

    return NextResponse.json({
      message: 'Users found',
      data: matchingUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'error-fetching-suggestions' }, { status: 500 });
  } finally {
    client.release();
  }
}
