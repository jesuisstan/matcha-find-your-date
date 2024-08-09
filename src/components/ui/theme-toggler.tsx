'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ButtonMatcha
      variant="ghost"
      size="icon"
      title="Toggle theme"
      onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
      className="hover:bg-transparent hover:text-c42orange"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </ButtonMatcha>
  );
};

export default ThemeToggler;
