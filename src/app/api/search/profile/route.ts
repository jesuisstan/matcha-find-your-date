import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

// Define the POST request handler for fetching profile data
export async function POST(request: Request) {
  const { userId, nickname } = await request.json();

  // If no nickname is provided, return an error response
  if (!nickname) {
    return NextResponse.json({ error: 'nickname-not-provided' }, { status: 400 });
  }

  const client = await db.connect();

  try {
    // Fetch the user profile based on the provided nickname
    const query = `
      SELECT id, firstname, lastname, nickname, birthdate, sex, biography, tags, last_action, latitude, longitude, 
             address, online, raiting, sex_preferences, photos, confirmed, complete
      FROM users 
      WHERE nickname = $1
      AND confirmed = true
      AND complete = true
    `;
    const values = [nickname];

    const result = await client.query(query, values);

    // If no user is found, return an error response
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ message: 'profile-not-found' }, { status: 200 });
    }

    // Extract the user's profile data from the result
    const userProfile = result.rows[0];

    // Return the profile data as a response
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'error-fetching-profile' }, { status: 500 });
  } finally {
    // Release the database client
    client.release();
  }
}
