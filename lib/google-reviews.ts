/**
 * Google Maps reviews fetched live from SerpAPI.
 *
 * Responses are cached by Next.js' fetch cache and refreshed once per 24 hours,
 * so SerpAPI is called at most once a day per language.
 */
import type { Locale } from '@/i18n/routing';

// Revalidate cached SerpAPI responses once per 24 hours
const REVALIDATE_SECONDS = 24 * 60 * 60;

// Maximum number of reviews shown
const MAX_REVIEWS = 10;

// LYNIQ STUDIO, Děčín (overridable via GOOGLE_PLACE_ID)
const DEFAULT_PLACE_ID = 'ChIJ3VqQGwCfCUcRpJZDaZ232KU';

/**
 * SerpAPI response types for Google Maps Reviews
 * Based on actual SerpAPI response structure
 */
interface SerpAPIReview {
  rating: number;
  date: string; // e.g., "před 4 dny"
  iso_date: string; // ISO date string
  review_id: string; // Unique review identifier
  user: { name: string };
  snippet?: string; // Review text
  extracted_snippet?: {
    original?: string;
  };
}

interface SerpAPIResponse {
  reviews?: SerpAPIReview[];
  error?: string;
  place_info?: {
    rating?: number;
    reviews?: number;
  };
}

export interface GoogleReview {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewCreatedAt: Date;
}

export interface GooglePlaceInfo {
  rating: number | null;
  reviewCount: number | null;
}

/**
 * Fetches the best-rated Google Maps reviews and place rating.
 * Returns empty data (never throws) so the page still renders when SerpAPI is unavailable.
 *
 * @param locale - Language for relative dates such as "před 4 dny" / "4 days ago"
 */
export async function getGoogleReviews(locale: Locale): Promise<{
  reviews: GoogleReview[];
  placeInfo: GooglePlaceInfo | null;
}> {
  // Support both SERPAPI_KEY and SERPAPI for compatibility
  const serpApiKey = process.env.SERPAPI_KEY || process.env.SERPAPI;

  if (!serpApiKey) {
    console.error('SERPAPI_KEY or SERPAPI environment variable is not set');
    return { reviews: [], placeInfo: null };
  }

  const params = new URLSearchParams({
    engine: 'google_maps_reviews',
    place_id: process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID,
    sort_by: 'ratingHigh',
    hl: locale,
    api_key: serpApiKey,
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const data: SerpAPIResponse = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`SerpAPI error: ${data.error ?? response.status}`);
    }

    const reviews = (data.reviews ?? [])
      .filter((review) => review.review_id)
      .map((review) => ({
        id: review.review_id,
        authorName: review.user?.name || 'Anonymous',
        rating: Math.max(1, Math.min(5, Math.round(review.rating || 0))), // Clamp 1-5
        text: review.snippet || review.extracted_snippet?.original || null,
        relativeTime: review.date || '',
        reviewCreatedAt: review.iso_date ? new Date(review.iso_date) : new Date(),
      }))
      // Best first; newest first among equal ratings
      .sort((a, b) => b.rating - a.rating || b.reviewCreatedAt.getTime() - a.reviewCreatedAt.getTime())
      .slice(0, MAX_REVIEWS);

    const placeInfo = data.place_info
      ? {
          rating: data.place_info.rating ?? null,
          reviewCount: data.place_info.reviews ?? null,
        }
      : null;

    return { reviews, placeInfo };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return { reviews: [], placeInfo: null };
  }
}
