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

    // Create enum types if they do not already exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE sex_enum AS ENUM ('male', 'female');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE sex_preferences_enum AS ENUM ('men', 'women', 'bisexual');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create the 'users' table if it does not already exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        confirmed BOOLEAN DEFAULT false,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        nickname VARCHAR(255) NOT NULL,
        birthdate TEXT NOT NULL,
        sex sex_enum NOT NULL,
        biography TEXT,
        tags TEXT[] DEFAULT '{}' NOT NULL,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        address TEXT,
        sex_preferences sex_preferences_enum,
        photos TEXT[] DEFAULT '{}' NOT NULL,
        complete BOOLEAN DEFAULT false,
        raiting INT DEFAULT 21,
        registration_date TIMESTAMP WITH TIME ZONE,
        last_action TIMESTAMP WITH TIME ZONE,
        online BOOLEAN DEFAULT false,
        service_token TEXT
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
createTables().catch((error) => {
  console.error('Error in createTables:', error);
  process.exit(1); // Ensure the script exits with an error code
});
