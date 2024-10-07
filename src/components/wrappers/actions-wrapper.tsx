import { useEffect, useState } from 'react';
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
import MatchSkeleton from '@/components/ui/skeletons/match-skeleton';
import MatchWrapper from '@/components/wrappers/match-wrapper';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';

const ActionsWrapper = ({ dateProfile }: { dateProfile: TDateProfile }) => {
  const t = useTranslations();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);

  useEffect(() => {
    setLoading(true);
    const checkProfileStatus = async () => {
      if (!user || !dateProfile) return;

      try {
        const response = await fetch('/api/activity/check-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            profileToCheckId: dateProfile.id,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setIsLiked(result.isLiked);
          setIsMatch(result.isMatch);
          setIsBlocked(result.isBlocked);
          setIsBlockedBy(result.isBlockedBy); // todo
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, [user, dateProfile]);

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
        setUser({ ...user, ...result.updatedUserData });
        setIsLiked(result.isLiked);
        setIsMatch(result.isMatched); // Update match status based on result
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
        setUser({ ...user, ...result.updatedUserData });
        setIsBlocked(result.isBlocked);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="flex animate-pulse flex-row items-center space-x-3 self-center">
      <div className="h-[74px] w-[256px] rounded-2xl bg-muted lg:h-[104px] lg:w-36"></div>
      <MatchSkeleton />
    </div>
  ) : (
    <div className={clsx('flex max-w-fit flex-row gap-4 self-center')}>
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
          >
            <ShieldAlert />
            <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
              {t('report')}
            </div>
          </ButtonMatcha>
        </div>
      </div>

      {/* MATCH ? */}
      <MatchWrapper isMatch={isMatch} loading={loading} />
    </div>
  );
};

export default ActionsWrapper;
