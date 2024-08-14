import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const { id, firstname, lastname, nickname, birthdate, sex, biography, sex_preferences, tags, photos } = await req.json();

  const client = await db.connect();

  try {
    // Fetch the current user data from the database
    const existingUser = await client.sql`
      SELECT firstname, lastname, nickname, birthdate, sex, biography, sex_preferences, tags, photos 
      FROM users WHERE id = ${id};
    `;

    if (existingUser.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentUser = existingUser.rows[0];

    // Check if the new data is the same as the current data
    const isSameData =
      currentUser.firstname === firstname &&
      currentUser.lastname === lastname &&
      currentUser.nickname === nickname &&
      new Date(currentUser.birthdate).toISOString() === new Date(birthdate).toISOString() &&
      currentUser.sex === sex &&
      currentUser.biography === biography &&
      currentUser.sex_preferences === sex_preferences &&
      JSON.stringify(currentUser.tags) === JSON.stringify(tags) &&
      JSON.stringify(currentUser.photos) === JSON.stringify(photos);

    if (isSameData) {
      return NextResponse.json({ message: 'personal-data-is-up-to-date' });
    }

    // Update user data in the database
    await client.sql`
      UPDATE users SET
        firstname = ${firstname},
        lastname = ${lastname},
        nickname = ${nickname},
        birthdate = ${birthdate},
        sex = ${sex},
        biography = ${biography},
        sex_preferences = ${sex_preferences},
        tags = ${tags},
        photos = ${photos}
      WHERE id = ${id};
    `;

    return NextResponse.json({ message: 'user-data-updated-successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
