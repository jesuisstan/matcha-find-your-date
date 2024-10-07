'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import RadioGroup from '@/components/ui/radio/radio-group';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';
import { TSelectorOption } from '@/types/general';

const MatchaSymphaties = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [likesOptions, setLikesOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('liked') },
    { value: '1', label: t('liked-by') },
  ]);
  const [selectedOption, setSelectedOption] = useState('1'); // <"0" | "1">
  const [errorLiked, setErrorLiked] = useState('');
  const [errorLikedBy, setErrorLikedBy] = useState('');

  const [profilesLiked, setProfilesLiked] = useState<TDateProfile[]>([]);
  const [profilesLikedBy, setProfilesLikedBy] = useState<TDateProfile[]>([]);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/activity/get-likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          category: selectedOption,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        selectedOption === '0'
          ? setProfilesLiked(result.likes)
          : setProfilesLikedBy(result.likes);
        setUser({ ...user, ...result.user });
      } else {
        selectedOption === '0'
          ? setErrorLiked(result.error ? result.error : 'error-fetching-liked')
          : setErrorLikedBy(result.error ? result.error : 'error-fetching-liked-by');
      }
    } catch (error) {
      selectedOption === '0'
        ? setErrorLiked('error-fetching-liked')
        : setErrorLikedBy('error-fetching-liked-by');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLikes();
  }, [selectedOption]);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`symphaties`)}
            </h1>
          </div>

          {/* SUBHEADER */}
          <div className="tems-stretch flex justify-center align-middle xs:flex-row">
            <div className="w-full min-w-28 items-center justify-center self-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
              <RadioGroup
                label={t(`select-category`) + ':'}
                options={likesOptions}
                defaultValue="0"
                selectedItem={selectedOption}
                onSelectItem={setSelectedOption}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading || !user ? (
        <SuggestionsSkeleton />
      ) : selectedOption === '0' ? (
        !profilesLiked || profilesLiked?.length === 0 || errorLiked ? (
          <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
            <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
              <Frown size={84} />
            </div>
            <p className="text-center text-lg">
              {errorLiked ? t(`${errorLiked}`) : t(`no-liked-profiles`)}
            </p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
            {profilesLiked.map((dateProfile: TDateProfile, index: number) => (
              <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
            ))}
          </div>
        )
      ) : !profilesLikedBy || profilesLikedBy?.length === 0 || errorLikedBy ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} />
          </div>
          <p className="text-center text-lg">
            {errorLikedBy ? t(`${errorLikedBy}`) : t(`no-liked-by-profiles`)}
          </p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
          {profilesLikedBy.map((dateProfile: TDateProfile, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchaSymphaties;
