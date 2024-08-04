// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

// Import the PostgreSQL client from Vercel
const { db } = require('@vercel/postgres');

// Function to create the users table
async function createTables() {
  // Connect to the database
  const client = await db.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Create the UUID extension if it does not already exist
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create the 'users' table if it does not already exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        nickname VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        confirmed BOOLEAN DEFAULT false,
        birthdate DATE NOT NULL,
        sex VARCHAR(10) NOT NULL,
        biography TEXT,
        tags TEXT,
        complete BOOLEAN DEFAULT false,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        lastVisit TIMESTAMP,
        online BOOLEAN DEFAULT false,
        popularity INT DEFAULT 0,
        preferences VARCHAR(20) DEFAULT 'bisexual',
        avatars TEXT[],
        lang VARCHAR(10) DEFAULT 'en'
      );
    `);

    // Commit the transaction
    await client.query('COMMIT');

    console.log('Table "users" created successfully');
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query('ROLLBACK');
    console.error('Failed to create table "users"', error);
  } finally {
    // Release the client and exit
    await client.release();
    process.exit(); // Ensure the script exits properly
  }
}

// Execute the function and handle any errors
createTables().catch(error => {
  console.error('Error in createTables:', error);
  process.exit(1); // Ensure the script exits with an error code
});
