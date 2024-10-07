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

    // Step 2: Fetch visits based on the selected category (visited or visited by)
    let query = '';
    let queryParams = [];

    if (category === '0') {
      // Profiles the user has visited
      // todo add photos (delete the line after)
      query = `
        SELECT 
          users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
          users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
          users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete
        FROM visits
        JOIN users ON visits.visited_user_id = users.id
        WHERE visits.visitor_id = $1
        AND users.confirmed = true
        AND users.complete = true
      `;
      queryParams = [userId];
    } else if (category === '1') {
      // Profiles that have visited the user
      // todo add photos (delete the line after)
      query = `
        SELECT 
          users.id, users.firstname, users.lastname, users.nickname, users.birthdate, users.sex, 
          users.biography, users.tags, users.last_action, users.latitude, users.longitude, 
          users.address, users.online, users.raiting, users.sex_preferences, users.confirmed, users.complete
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
    const visits = visitsResult.rows;

    // Step 3: Transform each visit to include `age` and `tags_in_common`
    const transformedVisits = visits.map((visit) => {
      const tagsInCommon = visit.tags.filter((tag: string) => userTags.includes(tag)).length || 0;
      const age = calculateAge(visit.birthdate);

      return {
        id: visit.id,
        firstname: visit.firstname,
        lastname: visit.lastname,
        nickname: visit.nickname,
        age, // Calculated age from birthdate
        sex: visit.sex,
        biography: visit.biography,
        tags: visit.tags,
        tags_in_common: tagsInCommon, // Calculated tags in common with the current user
        last_action: visit.last_action,
        latitude: visit.latitude,
        longitude: visit.longitude,
        address: visit.address,
        online: visit.online,
        raiting: visit.raiting,
        sex_preferences: visit.sex_preferences,
        confirmed: visit.confirmed,
        complete: visit.complete,
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

    // Step 5: Return the visits and updated user data
    return NextResponse.json({
      visits: transformedVisits,
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
