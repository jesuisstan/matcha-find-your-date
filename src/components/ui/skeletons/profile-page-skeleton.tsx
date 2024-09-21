'use client';

import clsx from 'clsx';

import HeaderSkeleton from '@/components/ui/skeletons/header-skeleton';

const ProfilePageSkeleton = () => {
  return (
    <div>
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <HeaderSkeleton />
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        {/* LEFT SECTOR */}
        <div className={clsx('col-span-12 h-max space-y-5', 'lg:col-span-3')}>
          {/* Raiting Skeleton */}
          <div className="h-28 w-full animate-pulse rounded-2xl bg-muted"></div>

          {/* Location Skeleton */}
          <div className="h-28 w-full animate-pulse rounded-2xl bg-muted"></div>

          {/* Preferences Skeleton */}
          <div className="h-28 w-full animate-pulse rounded-2xl bg-muted"></div>
        </div>

        {/* CENTER SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-6')}>
          {/* Photos Skeleton */}
          <div className="h-[550px] w-full animate-pulse rounded-2xl bg-muted"></div>
        </div>

        {/* RIGHT SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-3')}>
          {/* Interests Skeleton */}
          <div className="h-56 w-full animate-pulse rounded-2xl bg-muted"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
