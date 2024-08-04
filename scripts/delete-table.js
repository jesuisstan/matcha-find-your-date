require('dotenv').config({ path: './.env.local' }); // Load environment variables from .env.local
const { db } = require('@vercel/postgres');

// Retrieve the table name from command-line arguments
const tableName = process.argv[2];

if (!tableName) {
  console.error('Please provide a table name as an argument.');
  process.exit(1);
}

// Validate and sanitize table name (basic validation for demonstration)
const validTableName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName) ? tableName : null;

if (!validTableName) {
  console.error('Invalid table name.');
  process.exit(1);
}

async function deleteTable(tableName) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    // Construct SQL query manually
    const query = `DROP TABLE IF EXISTS ${validTableName};`;
    await client.query(query);
    await client.query('COMMIT');

    console.log(`Table "${tableName}" deleted successfully`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Failed to delete table "${tableName}"`, error);
  } finally {
    await client.release();
    process.exit(); // Ensure the script exits properly
  }
}

deleteTable(validTableName);
