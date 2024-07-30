import { ALL_COUNTRY_ISO_CODES } from '@/constants/all-country-iso-codes';

// --------------- StockChart ---------------

// create a function to generate mock data
// this function will be used to generate mock data for the app
// it will take a number of object to be generated as an argument
// and will take a number of days to be generated as an argument
// and will take a number of range to be generated as an argument
// the function will return an array of objects with the following properties
// {
//   "id": "random id",
//   "color": "random color",
//   "name": "random name",
//   "data": [
//     [1634054400000, 150], // [timestamp, value]
//     [1634140800000, 200],
//         ...
//   ]
// }

export const generateMockDataChart = (
  numberOfObjects: number,
  numberOfDays: number,
  range: number,
  withColor: boolean = false
) => {
  // create an array of objects with the following properties
  return Array.from({ length: numberOfObjects }).map((_, i) => ({
    id: String(i),
    color: withColor ? randomColor() : undefined,
    name: randomName(),
    data: Array.from({ length: numberOfDays }).map((_, i) => [
      new Date(Date.now() - (numberOfDays - i) * 24 * 60 * 60 * 1000).getTime(),
      Math.random() * range,
    ]),
  }));
};

// --------------- HistoricalTable ---------------
export const generateMockDataTable = (number: number) => {
  return Array.from({ length: number }).map((_, index) => ({
    id: index,
    date: new Date(new Date().setDate(new Date().getDate() - index)).toISOString().split('T')[0],
    china: Math.floor(Math.random() * 1000).toLocaleString(),
    usa: Math.floor(Math.random() * 1000).toLocaleString(),
    france: Math.floor(Math.random() * 1000).toLocaleString(),
    germany: Math.floor(Math.random() * 1000).toLocaleString(),
    italy: Math.floor(Math.random() * 1000).toLocaleString(),
  }));
};

// --------------- TableOverview ---------------

// create a function to generate mock data for table overview
// this function will be used to generate mock data for the app
// it will take a number of object to be generated as an argument
// and generate two same objects with the same name but different unit
// the function will return an array of objects with the following properties
// {
//   id: 'random id',
//   name: 'random country code (2 letters)',
//   date: 'random date',
//   unit: 'random string between yty, flat',
//   value: 'random number between -100 and 100'
// }

export const generateMockDataTableOverview = (number: number) => {
  const usedCountryNames = new Set<string>();
  // create an array of objects with the following properties
  return Array.from({ length: number }).flatMap((_, i) => {
    let name = randomCountryCode();

    while (usedCountryNames.has(name)) {
      // if country code is already used, get a new one
      name = randomCountryCode();
    }

    usedCountryNames.add(name);

    return [
      {
        id: String(i),
        name,
        date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0],
        unit: 'level',
        value: Math.floor(Math.random() * 100),
      },
      {
        id: String(i),
        name,
        date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0],
        unit: 'yty',
        value: Math.floor(Math.random() * 200) - 100,
      },
    ];
  });
};

export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const randomName = () => {
  return Math.random().toString(36).substring(7);
};

export const randomCountryCode = () => {
  const randomIndex = Math.floor(Math.random() * ALL_COUNTRY_ISO_CODES.length);
  const randomCountry = ALL_COUNTRY_ISO_CODES[randomIndex];
  return randomCountry.code;
};
