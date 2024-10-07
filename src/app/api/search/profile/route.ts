import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { calculateAge } from '@/utils/format-string';

// Define the POST request handler for fetching profile data
export async function POST(request: Request) {
  const { userId, profileToFindId } = await request.json();

  // If no profileToFindId is provided, return an error response
  if (!profileToFindId) {
    return NextResponse.json({ error: 'id-not-provided' }, { status: 400 });
  }

  const client = await db.connect();

  const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
  const user = userResult.rows[0];

  if (!user) {
    return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
  }

  // Update user-requester's last action and set online status to true
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

  try {
    // Fetch the date profile based on the provided profileToFindId
    const query = `
      SELECT id, firstname, lastname, nickname, birthdate, sex, biography, tags, last_action, latitude, longitude, 
             address, online, raiting, sex_preferences, photos, confirmed, complete
      FROM users 
      WHERE id = $1
      AND confirmed = true
      AND complete = true
    `;
    const values = [profileToFindId];

    const result = await client.query(query, values);

    // If no user is found, return an error response
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { message: 'profile-not-found', user: updatedUserData },
        { status: 200 }
      );
    }

    // Extract the user's profile data from the result
    const matchingUserProfile = { ...result.rows[0], age: calculateAge(result.rows[0].birthdate) };

    // Return the profile data as a response
    return NextResponse.json({ user: updatedUserData, matchingUserProfile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'error-fetching-profile' }, { status: 500 });
  } finally {
    // Release the database client
    client.release();
  }
}
