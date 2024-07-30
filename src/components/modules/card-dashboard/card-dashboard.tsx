import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import CompactOverviewChart from '../charts/compact-overviewchart';
import CardDashboardSkeleton from './card-dashboard-skeleton';

import { Button } from '@/components/ui/button';
import { setColor } from '@/utils/set-color';

type CardDashboardTypes = {
  title: string;
  lastData: any[];
  filteredDataSeries: any[];
  dataKey: string;
  yAxisTitle: string;
  link: string;
  isLoading: boolean;
  percentage?: boolean;
};

const CardDashboard = ({
  title,
  lastData,
  filteredDataSeries,
  yAxisTitle,
  link,
  isLoading,
  percentage,
}: CardDashboardTypes) => {
  // Handle for selected country
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (lastData && lastData.length > 0) {
      setSelectedCountry(lastData[0].id);
    }
  }, [lastData]);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const selectedSeries: any[] = (filteredDataSeries ?? []).filter(
    (series: any) => series.id === selectedCountry
  );

  // Handle for loading data
  if (isLoading) {
    return <CardDashboardSkeleton />;
  }

  return (
    <div className="flex min-h-[350px] w-full flex-auto basis-1 rounded-2xl bg-card p-2 md:min-w-[500px]">
      <div className="flex max-h-[350px] min-w-[90px] flex-col gap-2 overflow-y-auto sm:min-w-[150px]">
        {lastData?.map((countryData, index) => (
          <div
            key={countryData.id + index}
            className={`mb-1 mr-2 flex cursor-pointer flex-col items-center rounded-2xl border p-2 shadow-md ${
              countryData.id === selectedCountry ? 'bg-gray-300' : ''
            }`}
            onClick={() => handleCountryClick(countryData.id)}
          >
            <div className="flex items-center gap-2">
              <Image
                src={`/country-flags/${countryData.country}.svg`}
                alt={`${countryData.country} flag`}
                width={0}
                height={0}
                className="h-[14px] w-[14px] rounded-full object-cover"
              />
              <h1 className="text-xs font-semibold sm:text-sm">
                {countryData.country.toUpperCase()}
              </h1>
              <div className="text-xs text-gray-400">{countryData.version}</div>
            </div>
            <div className="flex w-full flex-col items-center justify-around sm:flex-row">
              {Array.isArray(countryData.values) && countryData.values.length > 0 ? (
                countryData.values.map((valueData: any, index: any) => (
                  <div
                    key={index}
                    className={`text-xs sm:text-sm ${setColor(valueData.value, valueData.unit)}`}
                  >
                    {valueData.unit === 'yty' ? `${valueData.value}%` : `${valueData.value}`}
                  </div>
                ))
              ) : (
                <div
                  className={`text-xs sm:text-sm ${setColor(countryData.value, countryData.unit)}`}
                >
                  {countryData.unit === 'yty' ? `${countryData.value}%` : `${countryData.value}`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="ml-4 flex-1 overflow-hidden">
        <div className="relative w-full">
          <CompactOverviewChart
            height={310}
            series={selectedSeries}
            warningMessage="Loading data ..."
            hideNavigator
            hideBurgerMenu
            hideRangeSelector
            title={title}
            yAxisTitle={yAxisTitle}
            percentage={percentage}
            hideLegend
            hideScrollbar
          />
        </div>
        <div className="mt-2 flex w-full items-center justify-end">
          <Button className="flex items-center">
            <Link href={link} className="flex items-center">
              Go to page <ChevronRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardDashboard;
