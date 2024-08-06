import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    pass: process.env.SUPPORT_EMAIL_PASSWORD,
  },
});

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const client = await db.connect();

  try {
    // Generate a new confirmation token
    const confirmationToken = uuidv4();

    const result = await client.sql`
      UPDATE users
      SET confirmation_token = ${confirmationToken}
      WHERE email = ${email}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Define the confirmation URL
    const { origin } = new URL(req.url);
    const confirmationUrl = `${origin}/api/auth/confirm-email?token=${confirmationToken}`;

    // Send an email to the user with the confirmation URL
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      to: user.email,
      subject: 'Please confirm your email',
      html: `Click the link to confirm your email: <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });

    return NextResponse.json({ message: 'Confirmation email resent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to resend confirmation email' }, { status: 500 });
  } finally {
    client.release();
  }
}
