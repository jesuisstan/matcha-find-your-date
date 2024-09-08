import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/utils/server/check-user-details-filled';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, firstname, lastname, nickname, birthdate, sex } = body;

    // Parse the birthdate string into components
    const [birthYear, birthMonth, birthDay] = birthdate.split('-').map(Number);
    const today = new Date();

    // Calculate the user's age based on the parsed components
    let age = today.getFullYear() - birthYear;
    const monthDifference = today.getMonth() + 1 - birthMonth; // getMonth is 0-indexed
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDay)) {
      age--;
    }

    // Validate the birthdate
    if (new Date(birthdate) > today) {
      return NextResponse.json({ error: 'invalid-birthdate' }, { status: 400 });
    }
    if (age < 18) {
      return NextResponse.json({ error: 'under-18' }, { status: 400 });
    } else if (age > 142) {
      return NextResponse.json({ error: 'invalid-birthdate' }, { status: 400 });
    }

    // Step 2: Check if the user exists
    const selectQuery = `
        SELECT firstname, lastname, nickname, birthdate, sex
        FROM users 
        WHERE id = $1
      `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 3: Check if the data is up-to-date
    if (
      currentData.firstname === firstname &&
      currentData.lastname === lastname &&
      currentData.nickname === nickname &&
      currentData.birthdate === birthdate && // Compare as strings
      currentData.sex === sex
    ) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 4: Update the user data if needed
    const currentDate = new Date().toISOString();
    const updateQuery = `
        UPDATE users 
        SET firstname = $2, lastname = $3, nickname = $4, birthdate = $5, sex = $6, last_action = $7, online = true
        WHERE id = $1
        RETURNING id, firstname, lastname, nickname, birthdate, sex, last_action, online;
      `;
    const updateValues = [id, firstname, lastname, nickname, birthdate, sex, currentDate];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    // Check if all required fields are filled to determine `complete` status & Update the `complete` status if necessary
    const { complete, changedToCompleteFlag } = await checkIfUserDataIsFilled(client, id);
    if (changedToCompleteFlag) {
      await client.query('UPDATE users SET complete = $2 WHERE id = $1', [id, complete]);
    }

    return NextResponse.json({
      message: 'user-updated-successfully',
      user: { ...updatedUser, complete },
      changedToCompleteFlag,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
