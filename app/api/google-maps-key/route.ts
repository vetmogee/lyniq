import { NextResponse } from 'next/server';

/**
 * API route to get Google Maps API key
 * Server-side only - keeps the API key secure
 */
export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Google Maps API key:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch API key';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
