import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Open_Sans } from 'next/font/google';

import clsx from 'clsx';

import '@/styles/globals.css';
//import NextAuthProvider from '@/components/providers/next-auth-provider';

const ThemeProvider = dynamic(() => import('@/components/providers/theme-provider'), {
  ssr: false,
});

const openSans = Open_Sans({ subsets: ['latin'] });

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
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className={clsx(openSans.className, 'flex min-h-screen flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/*<NextAuthProvider>*/}
            {children}
          {/*</NextAuthProvider>*/}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
