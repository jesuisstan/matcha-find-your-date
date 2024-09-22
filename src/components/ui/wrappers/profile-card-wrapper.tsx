import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { MapPinned } from 'lucide-react';

import { SexPreferenceIcon } from './sex-preference-wrapper';

import AvatarMini from '@/components/ui/avatar-mini';
import { calculateAge } from '@/utils/format-string';

const ProfileCardWrapper = ({ profile }: { profile: any }) => {
  const t = useTranslations();
  const { theme } = useTheme();

  return (
    <Link href={`/search/${profile.id}`} passHref>
      {' '}
      {/* Link to the profile page */}
      <div className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2 smooth42transition hover:scale-105 hover:border-c42green">
        <AvatarMini src={profile?.photos[0]} nickname={profile?.nickname} width={40} height={40} />
        <div className="h-fit w-[160px] items-center justify-center self-center rounded-2xl text-center align-middle">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="max-w-32 truncate text-base font-bold" title={profile?.nickname}>
              {profile?.nickname}
            </p>
            {'/'}
            <p className="text-base">{calculateAge(profile?.birthdate)}</p>
          </div>

          <div className="m-2 flex flex-row items-center justify-center gap-2">
            <MapPinned size={15} />
            <p className="truncate text-sm" title={profile?.address}>
              {profile?.address}
            </p>
          </div>

          <div className="flex scale-90 flex-row items-center justify-center gap-2">
            {profile?.sex === 'male' ? (
              <div
                title={`${t('sex')} - ${t(`${profile?.sex}`)}`}
                className={clsx(
                  'flex items-center justify-center rounded-full',
                  theme === 'dark' ? 'bg-foreground' : ''
                )}
              >
                <div className="overflow-hidden rounded-full bg-transparent">
                  <Image
                    src="/sex/male.png"
                    alt="men"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-10 p-1"
                    placeholder="blur"
                    blurDataURL={'/sex/male.png'}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div
                title={`${t('sex')} - ${t(`${profile?.sex}`)}`}
                className={clsx(
                  'flex items-center justify-center rounded-full',
                  theme === 'dark' ? 'bg-foreground' : ''
                )}
              >
                <div className="overflow-hidden rounded-full bg-transparent">
                  <Image
                    src="/sex/female.png"
                    alt="female"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-10 p-1"
                    placeholder="blur"
                    blurDataURL={'/sex/female.png'}
                    priority
                  />
                </div>
              </div>
            )}
            {'/'}
            <SexPreferenceIcon preference={profile?.sex_preferences} theme={theme!} translate={t} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCardWrapper;
