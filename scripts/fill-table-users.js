// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });
const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');
const getUnconfirmedUsers = require('./fake-users-list-unconfirmed');
const getConfirmedUsers = require('./fake-users-list-confirmed');

// Function to insert users into the 'users' table
async function insertUsers() {
  const client = await db.connect();

  const password = 'qweasZ1!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1); // Registration date set to yesterday

  const unconfirmedUsers = getUnconfirmedUsers(hashedPassword, yesterday);
  const confirmedUsers = getConfirmedUsers(hashedPassword, yesterday);

  try {
    await client.query('BEGIN');

    // Insert unconfirmed users
    for (const user of unconfirmedUsers) {
      await client.query(
        `INSERT INTO users (email, password, firstname, lastname, nickname, birthdate, sex, sex_preferences, registration_date, confirmed, online, popularity, biography, tags, latitude, longitude, address, photos, last_action, complete, service_token)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          user.email,
          user.password,
          user.firstname,
          user.lastname,
          user.nickname,
          user.birthdate,
          user.sex,
          user.sex_preferences,
          user.registration_date,
          user.confirmed,
          user.online,
          user.popularity,
          user.biography,
          user.tags,
          user.latitude,
          user.longitude,
          user.address,
          user.photos,
          user.last_action,
          user.complete,
          user.service_token,
        ]
      );
    }

    // Insert confirmed users
    for (const user of confirmedUsers) {
      await client.query(
        `INSERT INTO users (email, password, firstname, lastname, nickname, birthdate, sex, sex_preferences, biography, latitude, longitude, address, tags, photos, registration_date, last_action, online, confirmed, complete, popularity, service_token)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          user.email,
          user.password,
          user.firstname,
          user.lastname,
          user.nickname,
          user.birthdate,
          user.sex,
          user.sex_preferences,
          user.biography,
          user.latitude,
          user.longitude,
          user.address,
          user.tags,
          user.photos,
          user.registration_date,
          user.last_action,
          user.online,
          user.confirmed,
          user.complete,
          user.popularity,
          user.service_token,
        ]
      );
    }

    await client.query('COMMIT');
    console.log('All users inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting users:', error);
  } finally {
    client.release();
    process.exit();
  }
}

insertUsers().catch((error) => {
  console.error('Error in insertUsers:', error);
  process.exit(1);
});
