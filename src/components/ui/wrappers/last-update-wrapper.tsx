import React from 'react';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';

type TLastUpdateProps = {
  loading: boolean;
  date: string | undefined;
};

const LastUpdateWrapper: React.FC<TLastUpdateProps> = ({ loading, date }) => {
  return (
    <div className="mt-4 flex flex-row justify-end gap-1 text-right text-sm text-secondary">
      {/*{t`common:table-overview.last-update`}{' '}*/}
      {loading || !date ? <DateSkeleton /> : (date ?? '')}
    </div>
  );
};

export default LastUpdateWrapper;
