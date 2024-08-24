import { useTranslations } from 'next-intl';

import { SquarePen } from 'lucide-react';

import ChipsOption from '@/components/ui/chips/chips-option';

type TStaticTagsGroupProps = {
  tagsList: string[];
  modifiable?: boolean;
  onModify?: () => void;
};

const StaticTagsGroup: React.FC<TStaticTagsGroupProps> = ({ tagsList, modifiable, onModify }) => {
  const t = useTranslations();

  if (!tagsList || tagsList.length === 0) {
    return null;
  }

  return (
    <div id="tags" className="relative flex flex-col justify-center">
      <div className="mb-4 text-base font-bold text-foreground">{'#' + t(`tags.tags`) + ':'}</div>
      <div className="relative flex flex-row flex-wrap justify-start gap-2">
        {tagsList.map((tag, index) => (
          <ChipsOption
            key={`${tag}-${index}`}
            paramName={tag}
            value={tag}
            isSelected={true}
            onSelect={() => {}} // No-op since this is static
          >
            <div>{t(`tags.${tag}`)}</div>
          </ChipsOption>
        ))}
      </div>

      {modifiable && (
        <div className="absolute right-1 top-0 text-foreground opacity-60 smooth42transition hover:opacity-100">
          <SquarePen size={18} onClick={onModify} />
        </div>
      )}
    </div>
  );
};

export default StaticTagsGroup;
