export type TStockChartDataItem = {
  id: string;
  name: string;
  date?: string;
  data?: [number | string, number][];
  unit?: string;
  approach?: string;
  indicator?: string;
  year?: string;
  commodity?: string;
  component?: string;
  fullName?: string;
  isoCode?: string;
  iso2?: string;
  value?: number;
  vesselType?: string;
  region?: string;
  color?: string;
  s3Url?: string;
  frequency?: string;
  country?: string;
  geoId?: string;
  version?: string;
};

export type TParsedHistoricalDataTable = {
  date: string;
  [country: string]: string;
};

export type TParsedHistoOverview = {
  lineplots: TStockChartDataItem[];
  table: TParsedHistoricalDataTable[];
};
