import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import clsx from 'clsx';

import '@/styles/globals.css';

const ThemeProvider = dynamic(() => import('@/components/providers/theme-provider'), {
  ssr: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500'],
});

export const metadata: Metadata = {
  title: 'Matcha',
  description: 'Because, love too can be industrialized',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

/* Note! To avoid hydration warnings, add suppressHydrationWarning to <html>, because next-themes updates that element.
    This property only applies one level deep, so it won't block hydration warnings on other elements. */
const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  // Fetch the messages based on the param.locale
  const messages = await getMessages({ locale: params.locale });

  if (!messages || Object.keys(messages).length === 0) {
    notFound(); // Trigger a 404 if the messages for the locale are not found
  }

  return (
    <html suppressHydrationWarning lang={params.locale}>
      <body className={clsx(montserrat.className, 'flex min-h-screen flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
