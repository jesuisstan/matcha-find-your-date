import { TGeoCoordinates, TSelectGeoOption } from '@/types/geolocation';
import { TUser } from '@/types/user';

/**
 * Function to create TSelectGeoOption from user?.address
 * @param address - user?.address
 * @returns TSelectGeoOption | null
 *  */
export const createTSelectGeoOption = (
  address: string | null | undefined
): TSelectGeoOption | null => {
  if (address) {
    return { value: address, label: address };
  }
  return null;
};

/** Function to create TGeoCoordinates from user?.latitude and user?.longitude
 * @param latitude - user?.latitude
 * @param longitude - user?.longitude
 * @returns TGeoCoordinates | null
 * */
export const createTGeoCoordinates = (
  latitude: number | null | undefined,
  longitude: number | null | undefined
): TGeoCoordinates | null => {
  if (
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined
  ) {
    return { lat: latitude, lng: longitude };
  }
  return null;
};

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
