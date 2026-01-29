import { NextResponse } from 'next/server';
import { getCachedGoogleReviews } from '@/lib/google-reviews';

/**
 * Public API route to fetch cached Google Maps reviews
 * No authentication required - reviews are public information
 */
export async function GET() {
  try {
    const reviews = await getCachedGoogleReviews();
    
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
    
    // Return empty array on error so the page still renders
    return NextResponse.json(
      { reviews: [], error: errorMessage },
      { status: 500 }
    );
  }
}
