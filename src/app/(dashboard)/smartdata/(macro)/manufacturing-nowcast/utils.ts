import {
  THistoryTableItemQMN,
  TLastDataItemQMN,
  TLastDataQMN,
  TLineplotsDataPointQMN,
  TLineplotsItemQMN,
  TLineplotsQMN,
  TListElementsQMN,
  TParsedDataChartItemQMN,
  TParsedHistoryDataQMN,
  TParsedLastDataItemQMN,
} from './types';

import { formatApiDateTableHistory } from '@/utils/format-api-date';
import {
  getCountryFullName,
  sortCountriesOptionsByCode,
  TSelectorOption,
} from '@/utils/format-array';

export const createCountriesOptions = (
  apiData: TListElementsQMN,
  translate: (key: string) => string
): TSelectorOption[] => {
  const countriesOptions: TSelectorOption[] = [];

  if (apiData && apiData.listElements && apiData.listElements.data) {
    apiData?.listElements.data.map((item: any) => {
      const countryKey = item.geoId[0].geoId[0].geoId + '_' + item.version;
      const countriesOption: TSelectorOption = {
        value: countryKey,
        label: translate(`${getCountryFullName(countryKey.split('_')[0])}`),
        version: item.version,
      };
      countriesOptions.push(countriesOption);
    });
  }

  return sortCountriesOptionsByCode(countriesOptions);
};

// PARSE LAST DATA TO OVERVIEW FORMAT
export const parseDataForOverviewTable = (apiData: TLastDataQMN): TParsedLastDataItemQMN[] => {
  let res: TParsedLastDataItemQMN[] = [];

  if (apiData && apiData.lastdate.data) {
    res = apiData.lastdate.data
      .filter((item) => item.value !== null && item.value !== undefined) // Filter out items with falsy values
      .map((item: TLastDataItemQMN) => ({
        id: item.geoId[0].geoId[0].geoId + '_' + item.version,
        name: item.geoId[0].geoId[0].geoId,
        approach: item.unit,
        date: item.date,
        value: item.value,
        unit: item.seasAdj,
        version: item.version,
      }));
  }
  return res;
};

// PARSE TO SERIE FORMAT (FOR CHART)
export const parseDataForChart = (
  apiData: TLineplotsQMN,
  translate: (key: string) => string
): TParsedDataChartItemQMN[] => {
  let res: TParsedDataChartItemQMN[] = [];

  if (apiData && apiData.lineplots.indicator) {
    res = apiData.lineplots?.indicator?.map((serie: TLineplotsItemQMN) => {
      return {
        id: serie.geoId[0].geoId[0].geoId + '_' + serie.version,
        name: translate(`${getCountryFullName(serie.geoId[0].geoId[0].geoId)}`),
        approach: serie.unit,
        data: serie.data.map((d: TLineplotsDataPointQMN) => {
          return [new Date(d.date).getTime(), d.index];
        }),
        version: serie.version,
      };
    });
  }
  return res;
};

// PARSE DATA TO HISTORY-TABLE FORMAT
export const parseDataForHistoryTable = (
  apiData: TLineplotsQMN,
  translate: (key: string) => string
): TParsedHistoryDataQMN => {
  const parsedDataMap: TParsedHistoryDataQMN = {};

  const lineplots = apiData?.lineplots;
  if (lineplots && lineplots.indicator) {
    lineplots.indicator.forEach((indicator: TLineplotsItemQMN) => {
      if (indicator.data) {
        const iso2 = indicator.geoId[0].geoId[0].geoId.toUpperCase();

        // need to translate countries' names here to match with column-titles of History Table (because column-titles are already translated in History Table)
        const countryName = translate(`${getCountryFullName(iso2)}`) + ' ' + indicator.version;

        indicator.data.forEach((dataPoint: TLineplotsDataPointQMN) => {
          if (dataPoint.index !== null) {
            const date = formatApiDateTableHistory(dataPoint.date);
            const roundedValue = dataPoint.index?.toFixed(4);

            const parsedEntry: THistoryTableItemQMN = {
              date: date,
              [countryName]: roundedValue,
              approach: indicator.unit,
            };

            // Check if the unit (aka 'approach' on the page) property exists within parsedDataMap
            if (!parsedDataMap[indicator.unit]) {
              parsedDataMap[indicator.unit] = {};
            }

            // Check if the date property exists within unit
            if (parsedDataMap[indicator.unit][date]) {
              // Update the existing entry with the latest country data (add new country to existing date)
              parsedDataMap[indicator.unit][date][countryName] = roundedValue;
            } else {
              // Add a new entry for the current date
              parsedDataMap[indicator.unit][date] = parsedEntry;
            }
          }
        });
      }
    });
  }

  return parsedDataMap;
};
