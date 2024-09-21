import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { haversineDistance } from '@/utils/server/haversine-distance';

export async function POST(request: Request) {
  const { userId, latitude, longitude, sexPreferences, tags } = await request.json();
  const maxDistance = 21; // Max distance in km
  const client = await db.connect();

  try {
    // Get user's data to ensure valid request
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const queryFilters: string[] = [];
    const queryValues: any[] = [userId];

    // Filter by sexual orientation
    if (sexPreferences === 'bisexual') {
      queryFilters.push(`sex_preferences = ANY(ARRAY['men', 'women', 'bisexual'])`);
    } else {
      queryFilters.push(`sex_preferences = $2`);
      queryValues.push(sexPreferences);
    }

    // Prepare the SQL query for nearby users
    const queryString = `
      SELECT 
        id, email, firstname, lastname, nickname, birthdate, sex, sex_preferences, latitude, longitude, tags, raiting, photos, address
      FROM users
      WHERE 
        id != $1
        AND ${queryFilters.join(' AND ')}
      ORDER BY (
        SELECT count(*) 
        FROM unnest(tags) AS tag 
        WHERE tag = ANY($3)
      ) DESC, raiting DESC;
    `;

    // Execute the query
    const result = await client.query(queryString, [userId, sexPreferences, tags]);
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
      message: 'Suggestions retrieved successfully',
      data: matchingUsers,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'error-fetching-suggestions' }, { status: 500 });
  } finally {
    client.release();
  }
}
