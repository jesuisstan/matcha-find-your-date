import { TGeoCoordinates, TGeoPosition, TSelectGeoOption } from '@/types/geolocation';
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

/** Function to create fake TGeoPosition from the current application language
 * @param language - current application language
 * @returns TGeoPosition
 * */
export const getFakeLocation = (language: string): TGeoPosition => {
  switch (language) {
    case 'fr':
      return {
        latitude: 48.8566,
        longitude: 2.3522,
        address: 'Paris, France',
      };
    case 'ru':
      return {
        latitude: 55.7558,
        longitude: 37.6173,
        address: 'Moscow, Russia',
      };
    default:
      return {
        latitude: 51.5074,
        longitude: -0.1278,
        address: 'London, UK',
      };
  }
};
