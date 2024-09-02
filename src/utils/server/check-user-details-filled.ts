import { VercelPoolClient } from '@vercel/postgres';

export async function checkIfUserDataIsFilled(
  client: VercelPoolClient,
  userId: string
): Promise<{ complete: boolean; changedToCompleteFlag: boolean }> {
  const query = `
    SELECT firstname, lastname, nickname, birthdate, sex, confirmed, biography, tags, latitude, longitude, address, sex_preferences, photos, complete
    FROM users
    WHERE id = $1
  `;
  const result = await client.query(query, [userId]);

  if (result.rowCount === 0) {
    throw new Error('user-not-found');
  }

  const userData = result.rows[0];
  const {
    firstname,
    lastname,
    nickname,
    birthdate,
    sex,
    confirmed,
    biography,
    tags,
    latitude,
    longitude,
    address,
    sex_preferences,
    photos,
    complete,
  } = userData;

  // Check if all required fields are filled
  const newCompleteStatus =
    confirmed &&
    firstname &&
    lastname &&
    nickname &&
    birthdate &&
    sex &&
    biography &&
    biography.length >= 42 &&
    Array.isArray(tags) &&
    tags.length >= 3 &&
    latitude &&
    longitude &&
    address &&
    sex_preferences &&
    Array.isArray(photos) &&
    photos.length >= 1;

  const changedToCompleteFlag = !complete && newCompleteStatus;

  return { complete: newCompleteStatus, changedToCompleteFlag };
}
