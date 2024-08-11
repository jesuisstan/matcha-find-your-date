// lastData types:
export type TLastDataItemQMN = {
  date: string;
  geoId: { geoId: { geoId: string }[] }[];
  seasAdj: string;
  unit: string;
  value: number;
  version: string;
};

export type TLastDataQMN = {
  lastdate: {
    data: TLastDataItemQMN[];
  };
};

// LineplotsData types:
export type TLineplotsDataPointQMN = {
  date: string;
  index: number;
};

export type TLineplotsItemQMN = {
  data: TLineplotsDataPointQMN[];
  geoId: { geoId: { geoId: string }[] }[];
  unit: string;
  version: string;
};

export type TLineplotsQMN = {
  lineplots: {
    indicator: TLineplotsItemQMN[];
  };
};

// listElements type:
export type TListElementsQMN = {
  listElements: {
    data: { geoId: { iso2: string }[] }[];
  };
};

// ParsedData types:
export type TParsedLastDataItemQMN = {
  id: string;
  name: string;
  approach: string; // called "unit" in raw API data
  date: string;
  value: number;
  unit: string; // called "seasAdj" in raw API data
  version: string;
};

export type TParsedDataChartItemQMN = {
  id: string;
  name: string;
  data: [number, number][];
  approach?: string; // called "unit" in raw API data
};

export type THistoryTableItemQMN = {
  date: string;
  [country: string]: string;
  approach: string; // called "unit" in raw API data
};

export type TParsedHistoryDataQMN = {
  [approach: string]: {
    [date: string]: THistoryTableItemQMN;
  };
};
