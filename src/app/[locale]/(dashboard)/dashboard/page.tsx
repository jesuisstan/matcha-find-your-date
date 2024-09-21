'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Microscope, ScanSearch, UserRoundCog } from 'lucide-react';

import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import { useRouter } from '@/navigation';
import useUserStore from '@/stores/user';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <div>
      {/* HEADER */}
      <div className="mb-5 flex flex-row flex-wrap items-center justify-center gap-5">
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">{t('welcome')}</h1>
        <Image
          src="/identity/logo-title-only.png"
          alt="Matcha"
          width={0}
          height={0}
          sizes="100vw"
          className={clsx(`h-auto w-56`)}
          placeholder="blur"
          blurDataURL={'/identity/logo-transparent.png'}
          priority
        />
      </div>

      <div className={clsx('flex w-[100%] flex-col content-center items-center gap-5')}>
        {/* NAVIGATION BUTTONS */}
        <div
          id="navigation-buttons"
          className={clsx(
            'flex w-[100%] flex-row flex-wrap content-center items-center justify-center gap-10 p-2 align-middle'
          )}
        >
          <div
            className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border bg-card p-5 text-center transition-all duration-300 ease-in-out hover:border-c42green"
            onClick={() => router.push('/profile')}
          >
            <p>{t('customize-profile')}</p>
            <UserRoundCog
              size={70}
              className="transition-all duration-300 ease-in-out hover:scale-125"
            />
          </div>

          <div
            className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border bg-card p-5 text-center transition-all duration-300 ease-in-out hover:border-c42green"
            onClick={() => router.push('/search/smart-suggestions')}
          >
            <p>{t('use-smart-suggestions')}</p>
            <ScanSearch
              size={70}
              className="transition-all duration-300 ease-in-out hover:scale-125"
            />
          </div>

          <div
            className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border bg-card p-5 text-center transition-all duration-300 ease-in-out hover:border-c42green"
            onClick={() => router.push('/search/advanced')}
          >
            <p>{t('use-advanced-search')}</p>
            <Microscope
              size={70}
              className="transition-all duration-300 ease-in-out hover:scale-125"
            />
          </div>
        </div>

        {/* POWERED BY */}
        <div
          id="powered-by"
          className={clsx(
            'flex w-[100%] flex-col content-center items-center justify-center gap-10 rounded-2xl bg-card p-5 align-middle'
          )}
        >
          <h2 className="text-center text-xl md:text-2xl lg:text-3xl">{t('powered-by')}</h2>
          <div id="logos-group" className="flex flex-row flex-wrap justify-center gap-20">
            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-html.png"
                alt="html"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-html.png'}
                priority
              />
              <p>HTML</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-css.png"
                alt="css"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-css.png'}
                priority
              />
              <p>CSS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-js.png"
                alt="js"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-js.png'}
                priority
              />
              <p>Javascript</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-ts.png"
                alt="ts"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-ts.png'}
                priority
              />
              <p>Typescript</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-react.png"
                alt="react"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-react.png'}
                priority
              />
              <p>React</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-nextjs.png"
                alt="nextjs"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-nextjs.png'}
                priority
              />
              <p>NextJS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-tailwindcss.png"
                alt="tailwindcss"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-tailwindcss.png'}
                priority
              />
              <p>TailwindCSS</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="https://lucide.dev/logo.light.svg"
                alt="lucide"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'https://lucide.dev/logo.light.svg'}
                priority
              />
              <p>Lucide</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-jwt.svg"
                alt="jwt"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-jwt.svg'}
                priority
              />
              <p>JWT</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-next-intl.png"
                alt="next-intl"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-next-intl.png'}
                priority
              />
              <p>Next-intl</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel.svg"
                alt="vercel"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-vercel.svg'}
                priority
              />
              <p>Vercel</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel-postgresql.svg"
                alt="vercel-postgresql"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-vercel-postgresql.svg'}
                priority
              />
              <p>Vercel PostgreSQL</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-vercel-blob.svg"
                alt="vercel-blob"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-vercel-blob.svg'}
                priority
              />
              <p>Vercel Blob</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-3">
              <Image
                src="/powered-by/logo-google-maps.png"
                alt="google-maps.png"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-16`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-google-maps.png'}
                priority
              />
              <p>Google Maps API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
