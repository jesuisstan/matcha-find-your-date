import React from 'react';

import { MapPinned } from 'lucide-react';

const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="flex max-w-72 animate-pulse flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5">
      {/* Avatar skeleton */}
      <div className="h-40 w-40 rounded-2xl bg-muted"></div>

      {/* Content skeleton */}
      <div className="h-fit w-52 items-center justify-center self-center rounded-2xl bg-muted p-2">
        {/* Name and age skeleton */}
        <div className="mb-2 flex flex-row items-center justify-center gap-2">
          <div className="h-6 w-24 rounded bg-card"></div>
          {'/'}
          <div className="h-6 w-6 rounded bg-card"></div>
        </div>

        {/* Address skeleton */}
        <div className="m-3 flex flex-row items-center justify-center gap-2">
          <MapPinned size={21} />
          <div className="h-5 w-32 rounded bg-card"></div>
        </div>

        {/* Sex and preference skeleton */}
        <div className="m-2 flex flex-row items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-full bg-card"></div>
          {'/'}
          <div className="h-10 w-10 rounded-full bg-card"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
