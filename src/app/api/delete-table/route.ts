import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST() {
  try {
    // Using the connection pool to execute the query
    await db.sql`BEGIN`;
    await db.sql`DROP TABLE IF EXISTS revenue;`;
    await db.sql`COMMIT`;

    return NextResponse.json({ message: 'Table "revenue" deleted successfully' });
  } catch (error) {
    await db.sql`ROLLBACK`;
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
