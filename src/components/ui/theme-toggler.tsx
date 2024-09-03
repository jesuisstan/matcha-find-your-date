'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';

const ThemeToggler = ({ translate }: { translate: (key: string) => string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <ButtonMatcha
      variant="ghost"
      size="icon"
      title={translate(`theme-toggle`)}
      onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
      className="hover:text-c42orange smooth42transition hover:bg-transparent"
    >
      <Sun className="rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{translate(`theme-toggle`)}</span>
    </ButtonMatcha>
  );
};

export default ThemeToggler;
