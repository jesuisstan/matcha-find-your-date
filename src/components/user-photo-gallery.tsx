'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { EmblaOptionsType } from 'embla-carousel';
import { SquarePen } from 'lucide-react';

import EmblaCarousel from '@/components/carousel/embla-carousel';
import FilledOrNot from '@/components/ui/filled-or-not';
import { TUser } from '@/types/user';

const EmptyPhoto = () => {
  return (
    <Image
      src={`/identity/logo-heart.png`}
      alt="heart"
      width={0}
      height={0}
      sizes="100vw"
      className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-c42orange"
      style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
      placeholder="blur"
      blurDataURL={'/identity/logo-heart.png'}
      priority
    />
  );
};

const UserPhotoGallery = ({
  user,
  modifiable,
  onModify,
}: {
  user: TUser | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = [
    <div
      key="slide1"
      className="m-3 mx-10 flex h-96 w-96 justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[0] ? (
        <Image
          src={`${user?.photos?.[0]}`}
          alt="photo1"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide2"
      className="m-3 mx-10 flex h-96 w-96 justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[1] ? (
        <Image
          src={`${user?.photos?.[1]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide3"
      className="m-3 mx-10 flex h-96 w-96 justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[2] ? (
        <Image
          src={`${user?.photos?.[2]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide4"
      className="m-3 mx-10 flex h-96 w-96 justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[3] ? (
        <Image
          src={`${user?.photos?.[3]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
    <div
      key="slide5"
      className="m-3 mx-10 flex h-96 w-96 justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {user?.photos?.[4] ? (
        <Image
          src={`${user?.photos?.[4]}`}
          alt="photo2"
          width={0}
          height={0}
          sizes="100vw"
          //className="h-auto w-full rounded-xl border-8 border-black"
          className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
          style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
          placeholder="blur"
          blurDataURL={'/identity/logo-square.png'}
          priority
        />
      ) : (
        <EmptyPhoto />
      )}
    </div>,
  ];

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        <h3 className="mb-4 text-left text-2xl font-bold">{t('photo-gallery')}</h3>
        {user?.photos ? (
          <div className="w-full max-w-4xl rounded-xl border-2 py-5">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>
        ) : (
          <p className="italic">{t('data-incomplete')}</p>
        )}
      </div>

      {modifiable && (
        <div className="absolute right-1 top-0 flex gap-1">
          <FilledOrNot size={18} filled={!!user?.photos && user?.photos.length > 1} />
          <div className="text-foreground opacity-60 transition-opacity hover:opacity-100">
            <SquarePen size={18} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPhotoGallery;
