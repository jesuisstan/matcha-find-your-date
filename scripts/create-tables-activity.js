// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

// Import the PostgreSQL client from Vercel
const { db } = require('@vercel/postgres');

async function createActivityTables() {
  // Connect to the database
  const client = await db.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Create the 'visits' table
    await client.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visitor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        visited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (visitor_id, visited_user_id)
      );
    `);

    // Create the 'likes' table
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        liker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        liked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (liker_id, liked_user_id)
      );
    `);

    // Create the 'matches' table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        user_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (user_one_id, user_two_id)
      );
    `);

    // Create the 'blocked_users' table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id SERIAL PRIMARY KEY,
        blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (blocker_id, blocked_user_id)
      );
    `);

    // Create the 'notifications' table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('visit', 'like', 'unlike', 'match', 'unmatch', 'block', 'unblock')),
        from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        notification_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        viewed BOOLEAN DEFAULT false
      );
    `);

    // Commit the transaction
    await client.query('COMMIT');

    console.log(
      'Tables "notifications", "blocked_users", "matches", "likes" & "visits" created successfully'
    );
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query('ROLLBACK');
    console.error('Failed to create Activity tables', error);
  } finally {
    // Release the client and exit
    await client.release();
    process.exit(); // Ensure the script exits properly
  }
}

// Execute the function and handle any errors
createActivityTables().catch((error) => {
  console.error('Error in createActivityTables:', error);
  process.exit(1); // Ensure the script exits with an error code
});
