'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Annoyed, RefreshCw } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import SmartSuggestionsSeleton from '@/components/ui/skeletons/smart-suggestions-skeleton';
import ProfileCardWrapper from '@/components/ui/wrappers/profile-card-wrapper';
import useUserStore from '@/stores/user';

const SmartSuggestions = () => {
  // Translate hook
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [suggestions, setSuggestions] = useState([]);

  const handleRefreshSuggestions = () => {
    setLoading(true);
    // todo
    setTimeout(() => {
      setLoading(false);
    }, 2000); // todo delete
    //setLoading(false); // todo
  };

  return (
    <div>
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.smart-suggestions`)}
            </h1>
          </div>
          <div className="flex flex-row items-stretch gap-4">
            <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
              <p className="text-justify text-sm">{t(`use-smart-suggestions`)}</p>
            </div>
            <div className="flex items-center justify-center">
              <ButtonMatcha
                size="icon"
                disabled={!user || loading}
                title={t(`search.refresh-suggestions`)}
                onClick={handleRefreshSuggestions}
              >
                <RefreshCw size={20} />
              </ButtonMatcha>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <SmartSuggestionsSeleton />
      ) : suggestions.length !== 0 ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Annoyed size={84} />
          </div>
          <p className="text-center text-lg">{t(`search.no-suggestions`)}</p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 smooth42transition">
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
          <ProfileCardWrapper profile={user} />
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
