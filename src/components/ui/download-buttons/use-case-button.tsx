'use client';

import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import { BookOpenText } from 'lucide-react';

import { Button } from '@/components/ui/button';

const UseCaseButton = ({ url, disabled }: { url: string; disabled?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Button
      className="w-full py-[1.35rem]"
      // onClick={() => window.open(td(smartdataName + '.use-case-url'), '_blank')}
      size={'lg'}
      disabled={disabled}
    >
      <a href={url} target="_blank">
        <div className="flex flex-row items-center justify-center gap-3 text-nowrap">
          <BookOpenText size={20} />
          <span>{t`common:documentation.discover-use-case`}</span>
        </div>
      </a>
    </Button>
  );
};

export default UseCaseButton;
