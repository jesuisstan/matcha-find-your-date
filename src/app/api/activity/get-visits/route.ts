import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, category } = body;

    // Step 1: Ensure the user exists
    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Step 2: Fetch visits based on the selected category (visited or visited by)
    let query = '';
    let queryParams = [];

    if (category === '0') {
      // Profiles the user has visited
      query = `
        SELECT 
          users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
          users.address, users.online, users.rating, users.sex_preferences
        FROM visits
        JOIN users ON visits.visited_user_id = users.id
        WHERE visits.visitor_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else if (category === '1') {
      // Profiles that have visited the user
      query = `
        SELECT 
          users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
          users.address, users.online, users.rating, users.sex_preferences
        FROM visits
        JOIN users ON visits.visitor_id = users.id
        WHERE visits.visited_user_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else {
      return NextResponse.json({ error: 'invalid-category' }, { status: 400 });
    }

    // Execute the query to get the visits
    const visitsResult = await client.query(query, queryParams);

    // Step 3: Update user's last_action and online status
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

    // Step 4: Return the visits and updated user data
    return NextResponse.json({
      visits: visitsResult.rows,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching visits:', error);

    // Use body data to reference category within the catch block
    const body = await req.json();
    const { category } = body;

    // Return error based on category
    return NextResponse.json(
      {
        error: category === '0' ? 'error-fetching-visited' : 'error-fetching-visited-by',
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
