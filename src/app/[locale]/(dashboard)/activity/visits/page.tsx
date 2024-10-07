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

const MatchaVisits = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [visitsOptions, setVisitsOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('visited') },
    { value: '1', label: t('visited-by') },
  ]);
  const [selectedOption, setSelectedOption] = useState('1'); // <"0" | "1">
  const [errorVisited, setErrorVisited] = useState('');
  const [errorVisitedBy, setErrorVisitedBy] = useState('');

  const [profilesVisited, setProfilesVisited] = useState<TDateProfile[]>([]);
  const [profilesVisitedBy, setProfilesVisitedBy] = useState<TDateProfile[]>([]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/activity/get-visits', {
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
          ? setProfilesVisited(result.visits)
          : setProfilesVisitedBy(result.visits);
        setUser({ ...user, ...result.user });
      } else {
        selectedOption === '0'
          ? setErrorVisited(result.error ? result.error : 'error-fetching-visited')
          : setErrorVisitedBy(result.error ? result.error : 'error-fetching-visited-by');
      }
    } catch (error) {
      selectedOption === '0'
        ? setErrorVisited('error-fetching-visited')
        : setErrorVisitedBy('error-fetching-visited-by');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchVisits();
  }, [selectedOption]);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`visits`)}
            </h1>
          </div>

          {/* SUBHEADER */}
          <div className="tems-stretch flex justify-center align-middle xs:flex-row">
            <div className="w-full min-w-28 items-center justify-center self-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
              <RadioGroup
                label={t(`select-category`) + ':'}
                options={visitsOptions}
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
        !profilesVisited || profilesVisited?.length === 0 || errorVisited ? (
          <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
            <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
              <Frown size={84} />
            </div>
            <p className="text-center text-lg">
              {errorVisited ? t(`${errorVisited}`) : t(`no-visited-profiles`)}
            </p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
            {profilesVisited.map((dateProfile: TDateProfile, index: number) => (
              <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
            ))}
          </div>
        )
      ) : !profilesVisitedBy || profilesVisitedBy?.length === 0 || errorVisitedBy ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} />
          </div>
          <p className="text-center text-lg">
            {errorVisitedBy ? t(`${errorVisitedBy}`) : t(`no-visited-by-profiles`)}
          </p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
          {profilesVisitedBy.map((dateProfile: TDateProfile, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchaVisits;
