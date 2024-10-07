import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { calculateAge } from '@/utils/format-string';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { userId, category } = body;

    if (!userId) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    // Step 1: Fetch the logged-in user's tags
    const userTagsResult = await client.query(`SELECT tags FROM users WHERE id = $1`, [userId]);

    if (userTagsResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 });
    }

    const userTags = userTagsResult.rows[0].tags || [];

    // Step 2: Fetch likes based on the selected category (liked or liked by)
    let query = '';
    let queryParams = [];

    if (category === '0') {
      // Profiles the user has liked
      // todo add photos (delete the line after)
      query = `
        SELECT 
          users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
          users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
          users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete
        FROM likes
        JOIN users ON likes.liked_user_id = users.id
        WHERE likes.liker_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else if (category === '1') {
      // Profiles that have liked the user
      // todo add photos (delete the line after)
      query = `
        SELECT 
          users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
          users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
          users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete
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
    const likes = likesResult.rows;

    // Step 3: Transform each like to include `age` and `tags_in_common`
    const transformedLikes = likes.map((like) => {
      const tagsInCommon = like.tags.filter((tag: string) => userTags.includes(tag)).length || 0;
      const age = calculateAge(like.birthdate);

      return {
        id: like.id,
        firstname: like.firstname,
        lastname: like.lastname,
        nickname: like.nickname,
        age, // Calculated age from birthdate
        sex: like.sex,
        biography: like.biography,
        tags: like.tags,
        tags_in_common: tagsInCommon, // Calculated tags in common with the current user
        last_action: like.last_action,
        latitude: like.latitude,
        longitude: like.longitude,
        address: like.address,
        online: like.online,
        raiting: like.raiting,
        sex_preferences: like.sex_preferences,
        confirmed: like.confirmed,
        complete: like.complete,
      };
    });

    // Step 4: Update user's last_action and online status
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

    // Step 5: Return the likes and updated user data
    return NextResponse.json({
      likes: transformedLikes,
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
