'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';

import { usePathname } from '@/navigation';

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const localActive = useLocale();
  const pathname = usePathname();

  const handleLocaleChange = (locale: string) => {
    startTransition(() => {
      window.location.href = `/${locale}${pathname}`;
    });
  };

  return (
    <div className="flex space-x-4 self-center align-middle">
      <button
        className={`rounded-full px-2 py-1 ${localActive === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => handleLocaleChange('en')}
        disabled={isPending}
      >
        EN
      </button>
      <button
        className={`rounded-full px-2 py-1 ${localActive === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => handleLocaleChange('ru')}
        disabled={isPending}
      >
        RU
      </button>
      <button
        className={`rounded-full px-2 py-1 ${localActive === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => handleLocaleChange('fr')}
        disabled={isPending}
      >
        FR
      </button>
    </div>
  );
}
