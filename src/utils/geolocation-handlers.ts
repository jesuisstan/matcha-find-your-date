import { Dispatch, SetStateAction } from 'react';

import { TGeoCoordinates, TGeoPosition, TSelectGeoOption } from '@/types/geolocation';

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

/**
 * Function to get city coordinates from the entered city value
 * @param city - city to geocode
 * @returns
 */
export const geocodeCity = async (city: string) => {
  try {
    const response = await fetch(`/api/location-proxy?input=${city}&type=geocode`);
    const data = await response.json();
    const location = data?.results[0]?.geometry?.location;
    if (location) {
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error geocoding city:', error);
    throw error;
  }
};

/**
 * Function to get the city name from the coordinates
 * @param lat - latitude
 * @param lng - longitude
 * @param setError - function to set error message
 * @param translate - function to translate the error message
 * @returns
 */
export const reverseGeocode = async (
  lat: number,
  lng: number,
  setError?: Dispatch<SetStateAction<string>>,
  translate?: (key: string) => string
) => {
  setError!('');
  try {
    const response = await fetch(`/api/location-proxy?lat=${lat}&lng=${lng}&type=reverse-geocode`);
    const data = await response.json();
    const addressComponents = data?.results[0]?.address_components || [];
    const country = addressComponents.find((c: any) => c.types.includes('country'));

    const city = addressComponents.find(
      (c: any) => c.types.includes('locality') || c.types.includes('sublocality')
    );
    return {
      city: city
        ? { value: city.long_name, label: `${city.long_name}, ${country.long_name}` }
        : null,
    };
  } catch (error) {
    setError!(translate!('error-getting-location'));
    return null;
  }
};

/**
 * Function to load city options for autocomplete from the API based on user input
 * @param inputValue - user input
 * @param setError - function to set error message
 * @param translate - function to translate the error message
 * @returns
 */
export const loadCityOptions = async (
  inputValue: string,
  setError: Dispatch<SetStateAction<string>>,
  translate: (key: string) => string
): Promise<TSelectGeoOption[]> => {
  setError('');
  if (inputValue) {
    try {
      const response = await fetch(`/api/location-proxy?input=${inputValue}&type=autocomplete`);
      const data = await response.json();
      return (
        data?.predictions?.map((place: any) => ({
          value: place.description,
          label: place.description,
        })) || []
      );
    } catch (error) {
      setError(translate('error-loading-city-options'));
      return [];
    }
  }
  return [];
};
