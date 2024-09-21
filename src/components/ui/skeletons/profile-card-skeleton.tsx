import React from 'react';

import { MapPinned } from 'lucide-react';

const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="flex max-w-72 animate-pulse flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2">
      {/* Avatar skeleton */}
      <div className="h-40 w-40 rounded-2xl bg-muted"></div>

      {/* Content skeleton */}
      <div className="h-fit w-[160px] items-center justify-center self-center rounded-2xl">
        {/* Name and age skeleton */}
        <div className="mb-2 flex flex-row items-center justify-center gap-2">
          <div className="h-4 w-20 rounded bg-muted"></div>
          {'/'}
          <div className="h-4 w-6 rounded bg-muted"></div>
        </div>

        {/* Address skeleton */}
        <div className="m-3 flex flex-row items-center justify-center gap-2">
          <MapPinned size={15} />
          <div className="h-4 w-24 rounded bg-muted"></div>
        </div>

        {/* Sex and preference skeleton */}
        <div className="m-2 flex flex-row items-center justify-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted"></div>
          {'/'}
          <div className="h-7 w-7 rounded-full bg-muted"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
