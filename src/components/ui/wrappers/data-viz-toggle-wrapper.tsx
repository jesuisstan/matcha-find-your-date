import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';
import { AreaChartIcon, TablePropertiesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const DataVizToggleWrapper = ({
  dataViz,
  setDataViz,
}: {
  dataViz: 'chart' | 'table';
  setDataViz: React.Dispatch<React.SetStateAction<'chart' | 'table'>>;
}) => {
  const { t } = useTranslation();

  return (
    <div className="m-4 mb-0 flex flex-row justify-start space-x-2">
      <Button
        onClick={() => setDataViz('chart')}
        variant="outline"
        size="sm"
        className={clsx(
          dataViz === 'chart'
            ? 'bg-foreground text-background hover:bg-foreground hover:text-background'
            : ''
        )}
      >
        <AreaChartIcon size={20} />
        <span className="text-sm">{t`common:chart`}</span>
      </Button>
      <Button
        onClick={() => setDataViz('table')}
        variant="outline"
        size="sm"
        className={clsx(
          dataViz === 'table'
            ? 'bg-foreground text-background hover:bg-foreground hover:text-background'
            : ''
        )}
      >
        <TablePropertiesIcon size={18} />
        <span className="text-sm">{t`common:table`}</span>
      </Button>
    </div>
  );
};

export default DataVizToggleWrapper;
