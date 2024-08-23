import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, tags } = body;

    // Step 1: Validate the tags received from the frontend
    if (
      !Array.isArray(tags) ||
      tags.length < 3 ||
      !tags.every((tag) => typeof tag === 'string' && tag.trim() !== '')
    ) {
      return NextResponse.json({ error: 'error-minimum-tags-array' }, { status: 400 });
    }

    // Step 2: Check if the user exists
    const selectQuery = `
      SELECT tags
      FROM users 
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];
    const currentTags = currentData.tags || []; // Handle NULL as an empty array

    // Step 3: Check if the data is up-to-date (sort and compare the tags arrays)
    const currentTagsSorted = currentTags.slice().sort();
    const newTagsSorted = tags.slice().sort();
    const areTagsEqual = JSON.stringify(currentTagsSorted) === JSON.stringify(newTagsSorted);
    if (areTagsEqual) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 4: Update the user data if needed
    const updateQuery = `
      UPDATE users 
      SET tags = $2
      WHERE id = $1
      RETURNING id, tags;
    `;
    const updateValues = [id, tags];

    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({ message: 'user-updated-successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
