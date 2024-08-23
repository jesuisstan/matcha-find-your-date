import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { ChevronDown, ChevronUp, SquarePen } from 'lucide-react';

import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { capitalize } from '@/utils/format-string';

const DescriptionWrapper = ({
  text,
  modifiable,
  onModify,
}: {
  text: string | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div
      title={isDescriptionExpanded ? t('click-to-wrap') : t('click-to-unwrap')}
      onClick={toggleDescription}
      className={clsx(
        'relative w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-card p-4 pb-3 pt-2 transition-all duration-300 ease-in-out'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-base font-bold">{capitalize(t('bio'))}</p>
      <p
        className={clsx(
          'text-justify text-sm',
          isDescriptionExpanded ? 'h-auto' : 'text-ellipsis- line-clamp-3 h-[max-content]'
        )}
      >
        <TextWithLineBreaks text={text ?? t(`no-description`)} />
      </p>
      <div
        className={clsx(
          'absolute bottom-0 left-[50%] m-auto w-min translate-x-[-50%]',
          isHovered
            ? 'duration-400 text-c42orange transition-all ease-in-out'
            : 'duration-400 text-slate-200 transition-all ease-in-out'
        )}
      >
        {isDescriptionExpanded ? (
          <ChevronUp
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        ) : (
          <ChevronDown
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        )}
      </div>

      {modifiable && (
        <div className="absolute right-1 top-1 text-foreground opacity-60 smooth42transition hover:opacity-100">
          <SquarePen size={18} onClick={onModify} />
        </div>
      )}
    </div>
  );
};

export default DescriptionWrapper;
