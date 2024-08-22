'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import { ButtonMatcha } from './ui/button-matcha';

import countryDb from '@/constants/country-db';

type SelectOption = { value: string; label: string };
type GeoLocation = { lat: number; lng: number };

const LocationSearchBar = () => {
  const [selectedHomeCountryOption, setSelectedHomeCountryOption] = useState<SelectOption | null>(
    null
  );
  const [selectedHomeCityOption, setSelectedHomeCityOption] = useState<SelectOption | null>(null);
  const [homeGeoLocation, setHomeGeoLocation] = useState<GeoLocation | null>(null);

  const loadHomeCityOptions = async (inputValue: string): Promise<SelectOption[]> => {
    if (selectedHomeCountryOption && inputValue) {
      try {
        const response = await fetch(
          `/api/location-proxy?input=${inputValue}&type=autocomplete&country=${selectedHomeCountryOption.value}`
        );
        const data = await response.json();
        return (
          data?.predictions?.map((place: any) => ({
            value: place.description,
            label: place.description,
          })) || []
        );
      } catch (error) {
        console.error('Error loading city options:', error);
        return [];
      }
    }
    return [];
  };

  const getGeoLocation = async (address: string) => {
    try {
      const response = await fetch(`/api/location-proxy?input=${address}&type=geocode`);
      const data = await response.json();
      const location = data?.results[0]?.geometry?.location;
      return location || null;
    } catch (error) {
      console.error('Error getting geolocation:', error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (selectedHomeCityOption) {
        const geoLocation = await getGeoLocation(selectedHomeCityOption.value);
        if (isMounted) {
          setHomeGeoLocation(geoLocation);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedHomeCountryOption, selectedHomeCityOption]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeGeoLocation && selectedHomeCountryOption && selectedHomeCityOption) {
      const locationData = {
        homeLocation: {
          type: 'Point',
          coordinates: [homeGeoLocation.lng, homeGeoLocation.lat],
          address: selectedHomeCityOption.value,
          country: selectedHomeCountryOption.value,
        },
      };
      console.log('Submitted Location Data:', locationData);
    }
  };
  console.log('coordinates:', homeGeoLocation?.lng, homeGeoLocation?.lat);
  console.log('address:', selectedHomeCityOption?.value);
  console.log('country:', selectedHomeCountryOption?.value);

  return (
    <main className="w-full pb-20 text-sm">
      <section className="flex h-full w-full flex-col gap-10">
        <div>
          <div className="w-full md:w-2/5">
            <label htmlFor="country">Country</label>
            <Select
              className="text-prim w-60 placeholder-black placeholder-opacity-25"
              value={selectedHomeCountryOption}
              onChange={setSelectedHomeCountryOption}
              options={countryDb}
              id="country"
              placeholder={'Select a Country'}
            />
          </div>
          <div className="w-full md:w-2/5">
            <label htmlFor="city">City</label>
            <AsyncSelect
              className="text-prim w-60 placeholder-black placeholder-opacity-25"
              value={selectedHomeCityOption}
              onChange={setSelectedHomeCityOption}
              loadOptions={loadHomeCityOptions}
              id="city"
              placeholder={'Search for a City'}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LocationSearchBar;
