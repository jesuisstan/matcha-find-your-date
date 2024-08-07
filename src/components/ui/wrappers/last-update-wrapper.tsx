import React from 'react';

import { DateSkeleton } from '@/components/ui/wrappers/labels-wrapper';
import { formatApiDateLastUpdate } from '@/utils/format-api-date';

interface LastUpdateProps {
  loading: boolean;
  date: string | undefined;
}

const LastUpdateWrapper: React.FC<LastUpdateProps> = ({ loading, date }) => {

  return (
    <div className="mt-4 flex flex-row justify-end gap-1 text-right text-sm text-secondary">
      {/*{t`common:table-overview.last-update`}{' '}*/}
      {loading || !date ? <DateSkeleton /> : formatApiDateLastUpdate(date ?? '')}
    </div>
  );
};

export default LastUpdateWrapper;
