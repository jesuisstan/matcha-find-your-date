import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/email-confirmation?error=invalid-token', req.url));
  }

  const client = await db.connect();

  try {
    const result = await client.sql`
      UPDATE users
      SET confirmed = true
      WHERE confirmation_token = ${token}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.redirect(new URL('/email-confirmation?error=invalid-token', req.url));
    }

    return NextResponse.redirect(
      new URL('/email-confirmation?message=email-confirmed-successfully', req.url)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(
      new URL('/email-confirmation?error=failed-to-confirm-email', req.url)
    );
  } finally {
    client.release();
  }
}

//import { NextResponse } from 'next/server';

//import { db } from '@vercel/postgres';

//// Функция для получения локали из заголовков запроса
//function getLocaleFromHeaders(headers: Headers) {
//  const acceptLanguage = headers.get('Accept-Language');
//  if (acceptLanguage) {
//    // Пример простой логики для извлечения первой локали
//    // Вы можете настроить это в зависимости от вашего формата локалей
//    const locale = acceptLanguage.split(',')[0].split('-')[0];
//    return locale;
//  }
//  return 'en'; // Возвращаем значение по умолчанию, если локаль не определена
//}

//export async function GET(req: Request) {
//  const url = new URL(req.url);
//  const token = url.searchParams.get('token');
//  const locale = getLocaleFromHeaders(req.headers);

//  if (!token) {
//    return NextResponse.redirect(new URL(`/${locale}/email-confirmation?error=invalid-token`, req.url));
//  }

//  const client = await db.connect();

//  try {
//    const result = await client.sql`
//      UPDATE users
//      SET confirmed = true
//      WHERE confirmation_token = ${token}
//      RETURNING *;
//    `;

//    if (result.rowCount === 0) {
//      return NextResponse.redirect(new URL(`/${locale}/email-confirmation?error=invalid-token`, req.url));
//    }

//    return NextResponse.redirect(
//      new URL(`/${locale}/email-confirmation?message=email-confirmed-successfully`, req.url)
//    );
//  } catch (error) {
//    console.error(error);
//    return NextResponse.redirect(
//      new URL(`/${locale}/email-confirmation?error=failed-to-confirm-email`, req.url)
//    );
//  } finally {
//    client.release();
//  }
//}
