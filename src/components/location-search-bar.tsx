'use client';
import { useState } from 'react';
import Select from 'react-select';
//AsyncSelect component is used for loading dynamic options in react-select
import AsyncSelect from 'react-select/async';

// A list of all countries
import countryDb from '@/constants/country-db';

type TGeoPosition = {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  isoCountryCode: string;
};

const getDefaultLocation = (language: string): TGeoPosition => {
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

const LocationSearchBar = () => {
  const [selectedHomeCountryOption, setSelectedHomeCountryOption] = useState(null);
  const [selectedHomeCityOption, setSelectedHomeCityOption] = useState(null);
  const [selectedDestinationCityOption, setDestinationCityOption] = useState(null);

  //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Mos&key=AIzaSyCcbuWdTk2KJLLFrLqvgxWGg9FEzpL93Io// debug delete

  //this function loads in the options to react-select AsyncSelect component asynchronously
  //here we do not scope the country location, the Google Maps Places API will however give preference to your browser location
  const loadDestinationCityOptions = async (inputValue, callback) => {
    if (inputValue) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
        );
        const data = await response.json();
        let places = [];
        data?.data?.predictions?.map((place, i) => {
          places = [...places, { value: place.description, label: place.description }];
        });

        callback(places);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <main className="w-full pb-20 text-sm">
      <section className="flex h-full w-full flex-col gap-10">
        <div>
          <form className=" mt-2 flex w-full flex-wrap gap-x-12 gap-y-20 md:mt-4">
            <div className="w-full md:w-2/5">
              <label htmlFor="homeCountry">Current Country</label>
              <Select
                className="text-prim placeholder-black placeholder-opacity-25"
                defaultValue={selectedHomeCountryOption}
                onChange={setSelectedHomeCountryOption}
                options={countryDb}
                id="homeCountry"
                placeholder={'Select a Country'}
              />
            </div>
            <div className="w-full md:w-2/5">
              <label htmlFor="homeCity">Home City</label>
              <Select
                className="text-prim placeholder-black placeholder-opacity-25"
                defaultValue={selectedHomeCityOption}
                onChange={setSelectedHomeCityOption}
                options={[]}
                id="homeCity"
                placeholder={'Search for a City'}
              />
            </div>
            <div className="w-full md:w-2/5">
              <label htmlFor="destinationCity">Destination City</label>
              <AsyncSelect
                className="text-prim placeholder-black placeholder-opacity-25"
                defaultValue={selectedDestinationCityOption}
                onChange={setDestinationCityOption}
                loadOptions={loadDestinationCityOptions}
                id="destinationCity"
                placeholder={"Search for a City"}
              />
            </div>
            <button
              className="bg-tert w-full rounded-3xl py-3  text-white opacity-100 md:mt-4 md:w-2/5"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Proceed
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LocationSearchBar;
