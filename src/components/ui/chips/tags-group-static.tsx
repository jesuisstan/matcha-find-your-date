import { useTranslations } from 'next-intl';

import { PenLine } from 'lucide-react';

import ChipsOption from '@/components/ui/chips/chips-option';
import FilledOrNot from '@/components/ui/filled-or-not';

type TStaticTagsGroupProps = {
  tagsList: string[];
};

const StaticTagsGroup: React.FC<TStaticTagsGroupProps> = ({ tagsList }) => {
  const t = useTranslations();

  return (
    <div id="tags" className="flex flex-col justify-center">
      <div className="mb-4 text-base font-bold text-foreground">{'#' + t(`tags.tags`) + ':'}</div>
      <div className="flex flex-row flex-wrap justify-start gap-2">
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
    </div>
  );
};

export default StaticTagsGroup;
