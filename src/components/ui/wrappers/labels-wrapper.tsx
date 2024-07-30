import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';

export const DateSkeleton = () => {
  return <div className="mt-1 h-3 w-36 animate-pulse rounded-full bg-muted" />;
};

type LabelsWrapperProps = {
  category: string;
  lastUpdate?: string;
  frequency: string;
  history: string;
  baseIndex?: string;
  loading: boolean;
};

const LabelsWrapper = ({
  category,
  lastUpdate,
  frequency,
  history,
  baseIndex,
  loading,
}: LabelsWrapperProps) => {
  const { t } = useTranslation();

  // Function to render line breaks in any content string in case it's complex & too long (i.e., baseIndex string)
  const renderTextWithLineBreaks = (text: string | undefined) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div
      className={clsx(
        'min-w grid max-h-28 grid-flow-col grid-rows-2 gap-x-4 rounded-2xl bg-card p-4 pb-2 pt-2'
      )}
    >
      <div className="w-max">
        <p className="text-base font-bold">{t`common:documentation.category`}</p>
        <p className="flex-wrap text-sm">{category}</p>
      </div>

      <div className="min-w-36">
        <p className="text-base font-bold">{t`common:documentation.last-update`}</p>
        {loading || !lastUpdate || lastUpdate === 'Invalid Date' ? (
          <DateSkeleton />
        ) : (
          <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={lastUpdate}>
            {lastUpdate}
          </p>
        )}
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{t`common:documentation.frequency`}</p>
        <p className="text-sm">{frequency}</p>
      </div>

      <div className="min-w-36">
        <p className="text-base font-bold">{t`common:documentation.history`}</p>
        {/* Render history with line breaks */}
        <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={history}>
          {renderTextWithLineBreaks(history)}
        </p>
      </div>

      {baseIndex && (
        <div className="w-max">
          <p className="text-base font-bold">{t`common:documentation.base-index`}</p>
          {/* Render baseIndex with line breaks */}
          <p className="line-clamp-3 h-[max-content] text-ellipsis text-sm" title={baseIndex}>
            {renderTextWithLineBreaks(baseIndex)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LabelsWrapper;
