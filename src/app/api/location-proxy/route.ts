import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputValue = searchParams.get('input');
  const type = searchParams.get('type');
  const country = searchParams.get('country');

  if (!inputValue || !type) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  let url = '';

  if (type === 'autocomplete') {
    url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=%28cities%29&components=country:${country}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
  } else if (type === 'geocode') {
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${inputValue}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
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
