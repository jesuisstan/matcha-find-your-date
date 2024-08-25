import { useTranslations } from 'next-intl';

import { SquarePen } from 'lucide-react';

import ChipsOption from '@/components/ui/chips/chips-option';
import FilledOrNot from '@/components/ui/filled-or-not';

type TStaticTagsGroupProps = {
  tagsList: string[];
  modifiable?: boolean;
  onModify?: () => void;
};

const StaticTagsGroup: React.FC<TStaticTagsGroupProps> = ({ tagsList, modifiable, onModify }) => {
  const t = useTranslations();

  return (
    <div id="tags" className="relative flex flex-col justify-center">
      <div className="mb-4 text-base font-bold text-foreground">{'#' + t(`tags.tags`) + ':'}</div>
      <div className="relative flex flex-row flex-wrap justify-start gap-2">
        {!tagsList || tagsList.length === 0 ? (
          <p className="italic">{t('data-incomplete')}</p>
        ) : (
          tagsList.map((tag, index) => (
            <ChipsOption
              key={`${tag}-${index}`}
              paramName={tag}
              value={tag}
              isSelected={true}
              onSelect={() => {}} // No-op since this is static
            >
              <div>{t(`tags.${tag}`)}</div>
            </ChipsOption>
          ))
        )}
      </div>

      {modifiable && (
        <div className={'absolute right-1 top-0 flex gap-1'}>
          <FilledOrNot size={18} filled={!!tagsList && tagsList.length >= 3} />
          <div className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}>
            <SquarePen size={18} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticTagsGroup;
