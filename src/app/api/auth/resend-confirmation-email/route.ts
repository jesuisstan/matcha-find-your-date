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
    return NextResponse.json({ error: 'email-required' }, { status: 400 });
  }

  const client = await db.connect();

  try {
    // Generate a new confirmation token & update the user with the new confirmation token
    const confirmationToken = uuidv4();
    const result = await client.query(
      'UPDATE users SET service_token = $1 WHERE email = $2 AND confirmed = false RETURNING *',
      [confirmationToken, email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'email-not-found-user-already-confirmed' },
        { status: 404 }
      );
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
      html: `To start using Matcha, please confirm your email by clicking the following link: <a href="${confirmationUrl}">Confirm your email</a>.`,
    });

    return NextResponse.json({ message: 'confirmation-resent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-resend-confirmation' }, { status: 500 });
  } finally {
    client.release();
  }
}
