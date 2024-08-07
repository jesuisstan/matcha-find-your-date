'use client';

import Link from 'next/link';

//import { useTranslations } from 'next-intl';
import { ChevronLeft } from 'lucide-react';

import { Button } from './ui/button';

const NotFound = () => {
  //const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-4xl font-bold">404: Not Found</h1>
        {/*<p className="text-lg">{t('not-found.content')}</p>*/}
        <Link href={`/dashboard`} className="mt-4 text-positive hover:text-c42orange">
          {/*{t(`go-to-home`)}*/}
          <Button size="icon" className="ml-2">
            <ChevronLeft></ChevronLeft>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
