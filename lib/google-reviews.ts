/**
 * Google Maps reviews from SerpAPI, stored in Vercel Global Config.
 *
 * A daily cron job (/api/cron/google-reviews) calls SerpAPI and writes the result
 * to Global Config, together with the datetime of that call. Pages only read from
 * Global Config, so SerpAPI is called once a day per language, no matter the traffic.
 */
import { get, parseConnectionString } from '@vercel/global-config';
import { routing, type Locale } from '@/i18n/routing';

// Maximum number of reviews shown
const MAX_REVIEWS = 10;

// LYNIQ STUDIO, Děčín (overridable via GOOGLE_PLACE_ID)
const DEFAULT_PLACE_ID = 'ChIJ3VqQGwCfCUcRpJZDaZ232KU';

// Global Config keys
const reviewsKey = (locale: Locale) => `googleReviews_${locale}`;
const LAST_FETCHED_AT_KEY = 'googleReviewsLastFetchedAt';

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

// JSON-safe shape stored in Global Config (dates as ISO strings)
interface StoredReviews {
  reviews: (Omit<GoogleReview, 'reviewCreatedAt'> & { reviewCreatedAt: string })[];
  placeInfo: GooglePlaceInfo | null;
}

/**
 * Calls SerpAPI for one language. Throws on failure.
 * Only used by the daily cron job - pages read from Global Config instead.
 */
async function fetchFromSerpApi(locale: Locale): Promise<StoredReviews> {
  // Support both SERPAPI_KEY and SERPAPI for compatibility
  const serpApiKey = process.env.SERPAPI_KEY || process.env.SERPAPI;
  if (!serpApiKey) {
    throw new Error('SERPAPI_KEY or SERPAPI environment variable is not set');
  }

  const params = new URLSearchParams({
    engine: 'google_maps_reviews',
    place_id: process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID,
    sort_by: 'ratingHigh',
    hl: locale,
    api_key: serpApiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params}`, { cache: 'no-store' });
  const data: SerpAPIResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`SerpAPI error (${locale}): ${data.error ?? response.status}`);
  }

  const reviews = (data.reviews ?? [])
    .filter((review) => review.review_id)
    .map((review) => ({
      id: review.review_id,
      authorName: review.user?.name || 'Anonymous',
      rating: Math.max(1, Math.min(5, Math.round(review.rating || 0))), // Clamp 1-5
      text: review.snippet || review.extracted_snippet?.original || null,
      relativeTime: review.date || '',
      reviewCreatedAt: review.iso_date ? new Date(review.iso_date).toISOString() : new Date().toISOString(),
    }))
    // Best first; newest first among equal ratings
    .sort((a, b) => b.rating - a.rating || b.reviewCreatedAt.localeCompare(a.reviewCreatedAt))
    .slice(0, MAX_REVIEWS);

  const placeInfo = data.place_info
    ? {
        rating: data.place_info.rating ?? null,
        reviewCount: data.place_info.reviews ?? null,
      }
    : null;

  return { reviews, placeInfo };
}

/**
 * Calls SerpAPI for every language and writes the results plus the datetime of the
 * call to Global Config. Nothing is written if any language fails, so the previous
 * day's reviews stay in place.
 *
 * Writing goes through the Vercel REST API and needs VERCEL_API_TOKEN
 * (and VERCEL_TEAM_ID when the store belongs to a team).
 */
export async function refreshGoogleReviews(): Promise<{ lastFetchedAt: string }> {
  const connection = parseConnectionString(process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG || '');
  if (!connection) {
    throw new Error('GLOBAL_CONFIG environment variable is not set');
  }
  const apiToken = process.env.VERCEL_API_TOKEN;
  if (!apiToken) {
    throw new Error('VERCEL_API_TOKEN environment variable is not set');
  }

  const lastFetchedAt = new Date().toISOString();
  const results = await Promise.all(routing.locales.map(fetchFromSerpApi));

  const items = [
    ...routing.locales.map((locale, i) => ({
      operation: 'upsert',
      key: reviewsKey(locale),
      value: results[i],
    })),
    { operation: 'upsert', key: LAST_FETCHED_AT_KEY, value: lastFetchedAt },
  ];

  const teamQuery = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
  const response = await fetch(`https://api.vercel.com/v1/edge-config/${connection.id}/items${teamQuery}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Global Config write failed: ${response.status} ${await response.text()}`);
  }

  return { lastFetchedAt };
}

/**
 * Reads the stored reviews and place rating from Global Config.
 * Returns empty data (never throws) so the page still renders without them.
 *
 * @param locale - Language for relative dates such as "před 4 dny" / "4 days ago"
 */
export async function getGoogleReviews(locale: Locale): Promise<{
  reviews: GoogleReview[];
  placeInfo: GooglePlaceInfo | null;
}> {
  try {
    const stored = await get<StoredReviews>(reviewsKey(locale));
    if (!stored) {
      console.warn(`No reviews in Global Config for "${locale}" yet - run /api/cron/google-reviews`);
      return { reviews: [], placeInfo: null };
    }

    return {
      reviews: stored.reviews.map((review) => ({
        ...review,
        reviewCreatedAt: new Date(review.reviewCreatedAt),
      })),
      placeInfo: stored.placeInfo,
    };
  } catch (error) {
    console.error('Error reading Google reviews from Global Config:', error);
    return { reviews: [], placeInfo: null };
  }
}

