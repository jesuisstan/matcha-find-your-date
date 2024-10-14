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

    // Step 2: Fetch likes based on the selected category (liked or liked by)
    let query = '';
    let queryParams = [];

    if (category === '0') {
      // Profiles the user has liked
      query = `
        SELECT 
          users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
          users.address, users.online, users.rating, users.sex_preferences
        FROM likes
        JOIN users ON likes.liked_user_id = users.id
        WHERE likes.liker_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else if (category === '1') {
      // Profiles that have liked the user
      query = `
        SELECT 
          users.id, users.nickname, users.birthdate, users.sex, ARRAY[photos[1]] AS photos,
          users.address, users.online, users.rating, users.sex_preferences
        FROM likes
        JOIN users ON likes.liker_id = users.id
        WHERE likes.liked_user_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else {
      return NextResponse.json({ error: 'invalid-category' }, { status: 400 });
    }

    // Execute the query to get the likes
    const likesResult = await client.query(query, queryParams);

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

    // Step 4: Return the likes and updated user data
    return NextResponse.json({
      likes: likesResult.rows,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error fetching likes:', error);

    // Use body data to reference category within the catch block
    const body = await req.json();
    const { category } = body;

    // Return error based on category
    return NextResponse.json(
      {
        error: category === '0' ? 'error-fetching-liked' : 'error-fetching-liked-by',
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
