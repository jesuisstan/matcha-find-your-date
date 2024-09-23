'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { CircleHelp, Star } from 'lucide-react';

import ModalRaitingDescription from '@/components/modals/modal-raiting-description';

export const getColorByRating = (rating: number) => {
  if (rating >= 80) return 'text-c42green';
  if (rating >= 60) return 'text-yellow-500';
  if (rating >= 40) return 'text-c42orange';
  return 'text-negative';
};

const RaitingWrapper = ({ raiting }: { raiting: number | undefined }) => {
  const t = useTranslations();
  const [showModalRaitingDescription, setShowModalRaitingDescription] = useState(false);

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-md">
      <ModalRaitingDescription
        show={showModalRaitingDescription}
        setShow={setShowModalRaitingDescription}
      />
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t('raiting')}</h3>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            {raiting !== undefined ? (
              <div className="flex items-center gap-2">
                <Star
                  size={28}
                  className={clsx('animate-bounce smooth42transition', getColorByRating(raiting))}
                />

                <span
                  className={clsx(
                    'text-3xl font-bold transition-all duration-300 ease-in-out',
                    getColorByRating(raiting)
                  )}
                >
                  {raiting}
                </span>

                <span className="text-xl">/ 100</span>
              </div>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            <div className="absolute right-2 top-2 flex gap-1">
              <div
                className="text-foreground opacity-60 smooth42transition hover:opacity-100"
                title={t('what-is-this')}
              >
                <CircleHelp size={20} onClick={() => setShowModalRaitingDescription(true)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaitingWrapper;
