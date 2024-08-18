import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { capitalize } from '@/utils/format-string';

const DescriptionWrapper = ({ text }: { text: string | undefined }) => {
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
      <p className="text-base font-bold">{capitalize(t('description'))}</p>
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
    </div>
  );
};

export default DescriptionWrapper;
