import Image from 'next/image';
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
    <div className="flex max-w-72 flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 smooth42transition hover:scale-105">
      <AvatarMini src={profile.photos[0]} nickname={profile.nickname} width={40} height={40} />
      <div className="h-fit w-52 items-center justify-center self-center rounded-2xl bg-muted p-2 text-center align-middle">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="max-w-32 truncate text-lg font-bold" title={profile.nickname}>
            {profile.nickname}
          </p>
          {'/'}
          <p className="text-lg">{calculateAge(profile?.birthdate)}</p>
        </div>

        <div className="m-2 flex flex-row items-center justify-center gap-2">
          <MapPinned size={21} />
          <p className="text-base">{profile?.address}</p>
        </div>

        <div className="m-2 flex flex-row items-center justify-center gap-2">
          <p className="text-lg">{}</p>

          {profile.sex === 'male' ? (
            <div
              title={`${t('sex')} - ${t(`${profile.sex}`)}`}
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
              title={`${t('sex')} - ${t(`${profile.sex}`)}`}
              className={clsx(
                'flex items-center justify-center rounded-full',
                theme === 'dark' ? 'bg-foreground' : ''
              )}
            >
              <div className="overflow-hidden rounded-full bg-transparent">
                <Image
                  src="/sex/female.png"
                  alt="men"
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
          <SexPreferenceIcon preference={profile.sex_preferences} theme={theme!} translate={t} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCardWrapper;
