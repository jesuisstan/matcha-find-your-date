import { NextResponse } from 'next/server';

import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  
  const filename = searchParams.get('filename');
  console.log('searchParams', searchParams); // debug
  console.log('filename', filename); // debug

  const blob = await put(filename!, request?.body!, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
