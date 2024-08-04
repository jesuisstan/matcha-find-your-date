import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

import { customers, invoices, users } from '@/lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
     CREATE TABLE IF NOT EXISTS users (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
     );
   `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
         INSERT INTO users (id, name, email, password)
         VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
         ON CONFLICT (id) DO NOTHING;
       `;
    })
  );

  return insertedUsers;
}

/*
Pure SQL version of the seedUsers function:
-- Step 1: Create the UUID extension if it does not already exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create the 'users' table if it does not already exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, -- Unique identifier with default UUID generation
  name VARCHAR(255) NOT NULL, -- User's name, cannot be null
  email TEXT NOT NULL UNIQUE, -- User's email, must be unique and cannot be null
  password TEXT NOT NULL -- User's password, cannot be null
);

-- Step 3: Insert data into the 'users' table
-- The `ON CONFLICT (id) DO NOTHING` clause ensures that if a row with the same ID already exists,
-- it will not be inserted again, thus avoiding duplicate entries
INSERT INTO users (id, name, email, password)
VALUES 
  ('user-id-1', 'User Name 1', 'user1@example.com', 'hashed-password-1'), -- Example entry 1
  ('user-id-2', 'User Name 2', 'user2@example.com', 'hashed-password-2') -- Example entry 2
  -- Add additional rows here as needed
ON CONFLICT (id) DO NOTHING;
*/

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
     CREATE TABLE IF NOT EXISTS invoices (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       customer_id UUID NOT NULL,
       amount INT NOT NULL,
       status VARCHAR(255) NOT NULL,
       date DATE NOT NULL
     );
   `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
         INSERT INTO invoices (customer_id, amount, status, date)
         VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
         ON CONFLICT (id) DO NOTHING;
       `
    )
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
     CREATE TABLE IF NOT EXISTS customers (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       image_url VARCHAR(255) NOT NULL
     );
   `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
         INSERT INTO customers (id, name, email, image_url)
         VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
         ON CONFLICT (id) DO NOTHING;
       `
    )
  );

  return insertedCustomers;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
