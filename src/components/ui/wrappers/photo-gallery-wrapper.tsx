'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { EmblaOptionsType } from 'embla-carousel';
import { PenLine } from 'lucide-react';

import EmblaCarousel from '@/components/carousel/embla-carousel';
import FilledOrNot from '@/components/ui/filled-or-not';
import { TDateProfile } from '@/types/date-profile';
import { TUser } from '@/types/user';

const EmptyPhoto = () => {
  return (
    <Image
      src={`/identity/logo-square.png`}
      alt="matcha-heart"
      width={0}
      height={0}
      sizes="100vw"
      className="h-full w-full rounded-xl object-cover p-2 px-16 opacity-50 shadow-md shadow-c42orange"
      style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
      placeholder="blur"
      blurDataURL={'/identity/logo-heart.png'}
      priority
    />
  );
};

const PhotoGalleryWrapper = ({
  profile,
  modifiable,
  onModify,
}: {
  profile: TUser | TDateProfile | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();
  const [allPhotosFilled, setAllPhotosFilled] = useState<boolean>(
    profile?.photos?.length! >= 1 && profile?.photos?.length! < 5 ? false : true
  );

  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDES = [
    <div
      key="slide1"
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {profile?.photos?.[0] ? (
        <Image
          src={`${profile?.photos?.[0]}`}
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
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {profile?.photos?.[1] ? (
        <Image
          src={`${profile?.photos?.[1]}`}
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
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {profile?.photos?.[2] ? (
        <Image
          src={`${profile?.photos?.[2]}`}
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
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {profile?.photos?.[3] ? (
        <Image
          src={`${profile?.photos?.[3]}`}
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
      className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
    >
      {profile?.photos?.[4] ? (
        <Image
          src={`${profile?.photos?.[4]}`}
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

  // Alternative to create slides dynamically with no EmptyPhoto for nullable photos
  //const SLIDE_COUNT = profile?.photos?.length || 0;
  //const SLIDES = profile?.photos.map((photo, index) => (
  //  <div
  //    key={`slide-${index}`}
  //    className="m-3 mx-10 flex h-[335px] w-[335px] justify-center self-center smooth42transition sm:w-[400px] md:h-[400px]"
  //  >
  //    {photo ? (
  //      <Image
  //        src={`${photo}`}
  //        alt={`photo-${index}`}
  //        width={0}
  //        height={0}
  //        sizes="100vw"
  //        className="h-full w-full rounded-xl object-cover p-2 shadow-md shadow-positive"
  //        style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
  //        placeholder="blur"
  //        blurDataURL={'/identity/logo-square.png'}
  //        priority
  //      />
  //    ) : (
  //      <EmptyPhoto />
  //    )}
  //  </div>
  //));

  useEffect(() => {
    setAllPhotosFilled(
      profile?.photos?.length! >= 1 && profile?.photos?.length! < 5 ? false : true
    );
  }, [profile?.photos]);

  return (
    <div className="relative self-center rounded-2xl bg-card p-5">
      <div className="flex flex-col items-center">
        <div className="flex w-full max-w-screen-md flex-col items-center">
          {/*<h3 className="mb-4 text-left text-xl font-bold">{t('photo-gallery')}</h3>*/}
          {profile?.photos ? (
            <div className="w-full max-w-4xl rounded-xl py-5">
              <EmblaCarousel slides={SLIDES!} options={OPTIONS} />
            </div>
          ) : (
            <p className="italic">{t('data-incomplete')}</p>
          )}
        </div>

        {modifiable && (
          <div className="absolute right-2 top-2 flex gap-1">
            <FilledOrNot
              size={15}
              filled={!!profile?.photos && profile?.photos?.length >= 1}
              warning={!allPhotosFilled}
            />
            <div
              className="text-foreground opacity-60 transition-opacity hover:opacity-100"
              title={t('click-to-modify')}
            >
              <PenLine size={15} onClick={onModify} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryWrapper;
