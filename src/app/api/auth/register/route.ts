import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { firstname, lastname, nickname, email, password, birthdate, sex } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationToken = uuidv4(); // Generate a unique token

  const client = await db.connect();

  try {
    // Check if the email already exists
    const existingUser = await client.sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if ((existingUser.rowCount ?? 0) > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Define the confirmation URL
    const { origin } = new URL(req.url);
    const confirmationUrl = `${origin}/api/auth/confirm-email?token=${confirmationToken}`;

    if (!process.env.NEXT_PUBLIC_SUPPORT_EMAIL || !process.env.SUPPORT_EMAIL_PASSWORD) {
      throw new Error('Missing email credentials');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    // Send an email to the user with the confirmation URL
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      to: email,
      subject: 'Please confirm your email',
      html: `Click the link to confirm your email: <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });

    // If the email was sent successfully, insert the user into the database
    await client.sql`
      INSERT INTO users (firstname, lastname, nickname, email, password, birthdate, sex, confirmation_token)
      VALUES (${firstname}, ${lastname}, ${nickname}, ${email}, ${hashedPassword}, ${birthdate}, ${sex}, ${confirmationToken});
    `;

    return NextResponse.json({
      message: 'User registered successfully. Please check your email to confirm your account.',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  } finally {
    client.release();
  }
}
