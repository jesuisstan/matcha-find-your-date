'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Frown } from 'lucide-react';

import ProfilePageSkeleton from '@/components/ui/skeletons/profile-page-skeleton';
import DateProfileWrapper from '@/components/wrappers/date-profile-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const DateProfilePage = () => {
  const t = useTranslations();
  const { id: profileToFindId } = useParams(); // Grab the id from the dynamic route
  const { user, setUser, globalLoading } = useUserStore();
  const { getSmartSuggestionById } = useSearchStore();
  const [dateProfile, setDateProfile] = useState(
    getSmartSuggestionById(profileToFindId as string) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(profileToFindId);
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');

      // Ensure the id is available
      if (!profileToFindId) {
        setError('id-not-provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/search/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            profileToFindId: profileToFindId,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          if (result.message) {
            setError(result.message);
            setUser({ ...user, ...result.updatedUserData });
          } else {
            setDateProfile(result.matchingUserProfile);
            setUser({ ...user, ...result.updatedUserData });
          }
        } else {
          setError(result.error ? result.error : 'error-fetching-profile');
        }
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    if (user && !dateProfile) fetchUserProfile();
  }, [profileToFindId]);

  return error ? (
    <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
      <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
        <Frown size={84} />
      </div>
      <p className="text-center text-lg">{error ? t(`${error}`) : t(`profile-not-found`)}</p>
    </div>
  ) : loading || globalLoading || !user ? (
    <ProfilePageSkeleton />
  ) : (
    <DateProfileWrapper dateProfile={dateProfile!} />
  );
};

export default DateProfilePage;
