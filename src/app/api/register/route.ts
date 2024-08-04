import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { firstname, lastname, nickname, email, password, birthdate, sex, avatars } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await db.connect();

  try {
    await client.sql`
      INSERT INTO users (firstname, lastname, nickname, email, password, birthdate, sex, avatars)
      VALUES (${firstname}, ${lastname}, ${nickname}, ${email}, ${hashedPassword}, ${birthdate}, ${sex}, ${avatars});
    `;
    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  } finally {
    client.release; // todo: check if this is correct
  }
}
