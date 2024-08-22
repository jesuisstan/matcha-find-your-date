export type TGeoPosition = {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  isoCountryCode: string;
};

export const getDefaultLocation = (language: string): TGeoPosition => {
  switch (language) {
    case 'fr':
      return {
        latitude: 48.8566,
        longitude: 2.3522,
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        isoCountryCode: 'FR',
      };
    case 'ru':
      return {
        latitude: 55.7558,
        longitude: 37.6173,
        city: 'Moscow',
        region: 'Moscow',
        country: 'Russia',
        isoCountryCode: 'RU',
      };
    default:
      return {
        latitude: 51.5074,
        longitude: -0.1278,
        city: 'London',
        region: 'England',
        country: 'United Kingdom',
        isoCountryCode: 'GB',
      };
  }
};
