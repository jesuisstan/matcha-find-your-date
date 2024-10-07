import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import {
  CirclePower,
  CircleX,
  Heart,
  HeartOff,
  MessageCircleMore,
  ShieldAlert,
} from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import ActionsSkeleton from '@/components/ui/skeletons/actions-skeleton';
import MatchWrapper from '@/components/wrappers/match-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';

const ActionsWrapper = ({
  dateProfile,
  setDateProfile,
  isMatch,
  isLiked,
  isBlocked,
}: {
  dateProfile: TDateProfile;
  setDateProfile: Dispatch<SetStateAction<TDateProfile | null>>;
  isMatch: boolean;
  isLiked: boolean;
  isBlocked: boolean;
}) => {
  const t = useTranslations();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { updateSuggestion } = useSearchStore();
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interactions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likerId: user?.id,
          likedUserId: dateProfile.id,
          likeAction: isLiked ? 'unlike' : 'like',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setUser({ ...user, ...result.user });
        updateSuggestion(result.likedUser);
        setDateProfile({ ...dateProfile, ...result.likedUser });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interactions/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockerId: user?.id,
          blockedUserId: dateProfile.id,
          blockAction: isBlocked ? 'unblock' : 'block',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setUser({ ...user, ...result.user });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = async () => {
    if (!isBlocked) {
      setLoading(true);
      try {
        const response = await fetch('/api/interactions/block', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blockerId: user?.id,
            blockedUserId: dateProfile.id,
            blockAction: 'block',
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setUser({ ...user, ...result.user });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    // Open mail client with prefilled email, subject, and body
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
    const subject = `Report user ${dateProfile.nickname} as fake account`;
    const body = `Hello,

I would like to report the user ${dateProfile.nickname} (ID: ${dateProfile.id}) as a fake account. 

I suspect that this account violates the platform's guidelines, and I believe further investigation is needed.

REPORTER'S DETAILS:
${user?.firstname} ${user?.lastname} (${user?.nickname} / ID: ${user?.id})`;

    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the mail client
    window.location.href = mailtoLink;
  };

  return loading ? (
    <ActionsSkeleton />
  ) : (
    <div className={clsx('flex max-w-fit flex-row self-center rounded-2xl bg-card')}>
      {/* MATCH ? */}
      <MatchWrapper isMatch={isMatch} isBlocked={isBlocked} isLiked={isLiked} />
      {/* vertical divider */}
      <div className={clsx('my-3 block w-[1px] bg-secondary opacity-40')} />
      {/* ACTIONS */}
      <div
        className={clsx(
          'relative grid max-h-28 grid-flow-col grid-rows-1 items-center justify-center overflow-x-auto rounded-2xl bg-card p-4 pb-2 pt-2',
          'lg:min-h-[104px] lg:max-w-fit lg:grid-rows-2 lg:overflow-visible'
        )}
      >
        <div id="like-button">
          <ButtonMatcha
            variant="ghost"
            size="default"
            className="group relative hover:bg-transparent"
            onClick={handleLikeClick}
            disabled={isBlocked}
          >
            {!isLiked ? (
              <>
                <Heart />
                <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
                  {t('like')}
                </div>
              </>
            ) : (
              <>
                <HeartOff />
                <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
                  {t('unlike')}
                </div>
              </>
            )}
          </ButtonMatcha>
        </div>

        <div id="chat-button">
          <ButtonMatcha
            variant="ghost"
            size="default"
            className="group relative hover:bg-transparent"
            disabled={!isMatch || isBlocked}
          >
            <MessageCircleMore />
            <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
              {t('chat')}
            </div>
          </ButtonMatcha>
        </div>

        <div id="block-button">
          <ButtonMatcha
            variant="ghost"
            size="default"
            className="group relative hover:bg-transparent"
            onClick={handleBlockClick}
          >
            {!isBlocked ? (
              <>
                <CircleX />
                <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
                  {t('block')}
                </div>
              </>
            ) : (
              <>
                <CirclePower />
                <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
                  {t('unblock')}
                </div>
              </>
            )}
          </ButtonMatcha>
        </div>

        <div id="report-button">
          <ButtonMatcha
            variant="ghost"
            size="default"
            className="group relative hover:bg-transparent"
            onClick={handleReportClick}
          >
            <ShieldAlert />
            <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
              {t('report')}
            </div>
          </ButtonMatcha>
        </div>
      </div>
    </div>
  );
};

export default ActionsWrapper;
