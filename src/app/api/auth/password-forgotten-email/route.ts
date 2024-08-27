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
    // Generate a new confirmation token
    const confirmationToken = uuidv4();

    const result = await client.query(
      `UPDATE users
      SET service_token = $1
      WHERE email = $2
      RETURNING *`,
      [confirmationToken, email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'email-user-not-found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Define the confirmation URL
    const { origin } = new URL(req.url);
    const resetPasswordUrl = `${origin}/api/auth/password-reset?token=${confirmationToken}`;

    // Send an email to the user with the confirmation URL
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      to: user.email,
      subject: 'Reset password link',
      html: `Click the link to reset your Matcha password: <a href="${resetPasswordUrl}">Reset your password</a>.`,
    });

    return NextResponse.json({ message: 'reset-link-sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-send-reset-link' }, { status: 500 });
  } finally {
    client.release();
  }
}
