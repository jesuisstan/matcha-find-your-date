import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputValue = searchParams.get('inputValue');

  if (!inputValue) {
    return NextResponse.json({ error: 'No input value provided' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Google Places API' }, { status: 500 });
  }
}
