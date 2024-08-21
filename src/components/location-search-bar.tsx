import { useEffect, useState } from 'react';

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
  const [searchText, setSearchText] = useState('');
  const [geoPosition, setGeoPosition] = useState<TGeoPosition | null>(null);
  const [citiesData, setCitiesData] = useState<any[]>([]);

  const fetchCitiesData = async (text: string): Promise<any[]> => {
    if (text.length > 1) {
      // Use your preferred API to fetch city suggestions
      const response = await fetch(`https://api.example.com/cities?query=${text}`);
      const data = await response.json();
      return data.cities || [];
    } else {
      return [];
    }
  };

  const handleGeoChange = (text: string) => {
    setSearchText(text);
    fetchCitiesData(text);
  };

  const handleTextSubmit = async () => {
    if (!searchText) return;

    const cities: any[]  = await fetchCitiesData(searchText);
    if (cities.length > 0) {
      const selectedCity = cities[0];
      setGeoPosition({
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        city: selectedCity.name,
        region: selectedCity.region,
        country: selectedCity.country,
        isoCountryCode: selectedCity.isoCountryCode,
      });
    } else {
      alert('City not found');
    }
  };

  const handleLocationPress = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get city name from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
          );
          const data = await response.json();
          const cityData = data.results[0].address_components;
          setGeoPosition({
            latitude,
            longitude,
            city: cityData.locality,
            region: cityData.administrative_area_level_1,
            country: cityData.country,
            isoCountryCode: cityData.country_code,
          });
        },
        () => {
          alert('Permission denied. Setting default location.');
          const defaultLocation = getDefaultLocation(navigator.language.slice(0, 2));
          setGeoPosition(defaultLocation);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCityPress = (city: any) => {
    setGeoPosition({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      region: city.region,
      country: city.country,
      isoCountryCode: city.isoCountryCode,
    });
  };

  useEffect(() => {
    if (geoPosition) {
      console.log('TGeoPosition updated:', geoPosition); // debug
    }
  }, [geoPosition]);

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleGeoChange(e.target.value)}
          placeholder="Search Location"
        />
        <button onClick={handleTextSubmit}>Search</button>
        <button onClick={handleLocationPress}>Use my current location</button>
      </div>

      {citiesData.length > 0 && (
        <ul>
          {citiesData.map((city, index) => (
            <li key={index} onClick={() => handleCityPress(city)}>
              {city.name}, {city.region}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchBar;
