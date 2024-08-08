'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import clsx from 'clsx';

import { usePathname } from '@/navigation';

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const localActive = useLocale();
  const pathname = usePathname();

  const handleLocaleChange = (locale: string) => {
    if (localActive === locale || isPending) return;

    startTransition(() => {
      window.location.href = `/${locale}${pathname}`;
    });
  };

  return (
    <div className="flex space-x-4 self-center align-middle">
      <div
        className={clsx(
          `flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px] transition-all duration-300 ease-in-out`,
          `hover:border-c42orange`,
          localActive === 'fr' ? 'border-[1px] border-foreground' : 'bg-card'
        )}
        onClick={() => handleLocaleChange('fr')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/fr.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localActive === 'fr' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>

      <div
        className={clsx(
          `flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px] transition-all duration-300 ease-in-out`,
          `hover:border-c42orange`,
          localActive === 'en' ? 'border-[1px] border-foreground' : 'bg-card'
        )}
        onClick={() => handleLocaleChange('en')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/gb.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localActive === 'en' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>

      <div
        className={clsx(
          `flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px] transition-all duration-300 ease-in-out`,
          `hover:border-c42orange`,
          localActive === 'ru' ? 'border-[1px] border-foreground' : 'bg-card'
        )}
        onClick={() => handleLocaleChange('ru')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/ru.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localActive === 'ru' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>
    </div>
  );
}
