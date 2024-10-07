'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';

const MatchaMatches = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<TDateProfile[]>([]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/activity/get-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMatches(result.matches);
        setUser({ ...user, ...result.user });
      } else {
        setError(result.error ? result.error : 'error-fetching-matches');
      }
    } catch (error) {
      setError('error-fetching-matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMatches();
  }, []);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      <div className={clsx('flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`matches`)}
            </h1>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading || !user ? (
        <SuggestionsSkeleton />
      ) : !matches || matches?.length === 0 || error ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} />
          </div>
          <p className="text-center text-lg">{error ? t(`${error}`) : t(`no-matches`)}</p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
          {matches.map((dateProfile: TDateProfile, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchaMatches;
