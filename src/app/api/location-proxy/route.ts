import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputValue = searchParams.get('input');
  const type = searchParams.get('type');
  const country = searchParams.get('country');  // This is now optional
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lng');

  if (!type) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  let url = '';

  if (type === 'autocomplete') {
    if (!inputValue) {
      return NextResponse.json({ error: 'Missing input for autocomplete' }, { status: 400 });
    }
    url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=%28cities%29&key=${process.env.GOOGLE_MAPS_KEY}`;
    
    // Optionally append the country parameter if provided
    if (country) {
      url += `&components=country:${country}`;
    }
  } else if (type === 'geocode') {
    if (!inputValue) {
      return NextResponse.json({ error: 'Missing input for geocode' }, { status: 400 });
    }
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${inputValue}&key=${process.env.GOOGLE_MAPS_KEY}`;
  } else if (type === 'reverse-geocode') {
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Missing latitude or longitude for reverse geocode' }, { status: 400 });
    }
    url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_KEY}`;
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Google API' }, { status: 500 });
  }
}
