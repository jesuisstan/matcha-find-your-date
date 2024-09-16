import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { firstname, lastname, nickname, email, password, birthdate, sex } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationToken = uuidv4(); // Generate a unique token

  // Parse the birthdate string into components
  const [birthYear, birthMonth, birthDay] = birthdate.split('-').map(Number);
  const today = new Date();

  // Calculate the user's age based on the parsed components
  let age = today.getFullYear() - birthYear;
  const monthDifference = today.getMonth() + 1 - birthMonth; // getMonth is 0-indexed
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDay)) {
    age--;
  }

  // Validate the birthdate
  if (new Date(birthdate) > today) {
    return NextResponse.json({ error: 'invalid-birthdate' }, { status: 400 });
  }
  if (age < 18) {
    return NextResponse.json({ error: 'under-18' }, { status: 400 });
  } else if (age > 142) {
    return NextResponse.json({ error: 'invalid-birthdate' }, { status: 400 });
  }

  const client = await db.connect();

  try {
    // Check if the email or nickname already exists
    const existingUser = await client.sql`
      SELECT * FROM users WHERE email = ${email} OR nickname = ${nickname};
    `;

    if ((existingUser.rowCount ?? 0) > 0) {
      const existingRecord = existingUser.rows[0];

      if (existingRecord.email === email) {
        return NextResponse.json({ error: 'email-already-exists' }, { status: 400 });
      } else if (existingRecord.nickname === nickname) {
        return NextResponse.json({ error: 'nickname-already-exists' }, { status: 400 });
      }
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
      html: `To start using Matcha, please confirm your email by clicking the following link: <a href="${confirmationUrl}">Confirm your email</a>.`,
    });

    // If the email was sent successfully, insert the user into the database
    await client.sql`
      INSERT INTO users (firstname, lastname, nickname, email, password, birthdate, sex, registration_date, confirmed, service_token)
      VALUES (${firstname}, ${lastname}, ${nickname}, ${email}, ${hashedPassword}, ${birthdate}, ${sex}, NOW(), false, ${confirmationToken});
    `;

    return NextResponse.json({
      message: 'user-registered-successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-register-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
