import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, category } = body;

    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Fetch visits based on the selected category
    let query = '';
    let queryParams = [];
    if (category === '0') {
      // Profiles the user has visited
      query = `
        SELECT users.*
        FROM visits
        JOIN users ON visits.visited_user_id = users.id
        WHERE visits.visitor_id = $1
      `;
      queryParams = [userId];
    } else if (category === '1') {
      // Profiles that have visited the user
      query = `
        SELECT users.*
        FROM visits
        JOIN users ON visits.visitor_id = users.id
        WHERE visits.visited_user_id = $1
      `;
      queryParams = [userId];
    } else {
      return NextResponse.json({ error: 'invalid-category' }, { status: 400 });
    }

    // Execute the query to get the visits
    const visitsResult = await client.query(query, queryParams);
    const visits = visitsResult.rows;

    // Update user's last_action and online status
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

    return NextResponse.json({
      visits,
      updatedUserData: updatedUser,
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
