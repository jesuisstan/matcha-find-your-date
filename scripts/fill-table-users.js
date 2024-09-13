require('dotenv').config({ path: './.env.local' });
const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');
const getUnconfirmedUsers = require('./fake-users-list-unconfirmed');
const getConfirmedUsersMale = require('./fake-users-list-confirmed-male');
const getConfirmedUsersFemale = require('./fake-users-list-confirmed-female');

// Function to insert users into the 'users' table
async function insertUsers() {
  // Check if process.env.DEFAULT_PASS is defined
  if (!process.env.DEFAULT_PASS) {
    console.error('Environment variable DEFAULT_PASS is not defined.');
    process.exit(1);
  }

  const client = await db.connect();

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASS, 10);
    console.log('Password successfully hashed');
  } catch (error) {
    console.error('Error hashing password:', error);
    process.exit(1);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1); // Registration date set to yesterday

  const unconfirmedUsers = getUnconfirmedUsers(hashedPassword, yesterday);
  const confirmedUsersMale = getConfirmedUsersMale(hashedPassword, yesterday);
  const confirmedUsersFemale = getConfirmedUsersFemale(hashedPassword, yesterday);

  try {
    await client.query('BEGIN');
    console.log('...');

    // Insert unconfirmed users
    for (const user of unconfirmedUsers) {
      await client.query(
        `INSERT INTO users (email, password, firstname, lastname, nickname, birthdate, sex, sex_preferences, registration_date, confirmed, online, raiting, biography, tags, latitude, longitude, address, photos, last_action, complete, service_token)
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
          user.raiting,
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
    console.log('15 unconfirmed users are ready for inserting into database');
    console.log('...');

    // Insert confirmed users-men
    for (const user of confirmedUsersMale) {
      await client.query(
        `INSERT INTO users (email, password, firstname, lastname, nickname, birthdate, sex, sex_preferences, biography, latitude, longitude, address, tags, photos, registration_date, last_action, online, confirmed, complete, raiting, service_token)
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
          user.raiting,
          user.service_token,
        ]
      );
    }
    console.log('218 confirmed male users are ready for inserting into database');
    console.log('...');

    // Insert confirmed users-women
    for (const user of confirmedUsersFemale) {
      await client.query(
        `INSERT INTO users (email, password, firstname, lastname, nickname, birthdate, sex, sex_preferences, biography, latitude, longitude, address, tags, photos, registration_date, last_action, online, confirmed, complete, raiting, service_token)
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
          user.raiting,
          user.service_token,
        ]
      );
    }
    console.log('290 confirmed female users are ready for inserting into database');
    console.log('...');

    await client.query('COMMIT');
    console.log('DONE! ALL USERS INSERTED SUCCESSFULLY');
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
