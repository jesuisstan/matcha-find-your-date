import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matcha Smart Suggestions',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
