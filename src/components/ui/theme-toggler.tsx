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
      className="smooth42transition hover:bg-transparent hover:text-c42orange"
    >
      <div className="flex flex-row items-center gap-2">
        {theme === 'light' ? <Sun /> : <Moon />}
        {/*<p>{translate(`${theme}`)}</p>*/}
        <span className="sr-only">{translate(`${theme}`)}</span>
      </div>
    </ButtonMatcha>
  );
};

export default ThemeToggler;
