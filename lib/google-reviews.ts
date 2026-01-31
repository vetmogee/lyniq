import { prisma } from './prisma';
import { getJson } from 'serpapi';

/**
 * Google Maps Reviews Caching Service
 * 
 * This service fetches Google Maps reviews via SerpAPI and caches them in PostgreSQL.
 * It ensures:
 * - Only the 10 latest reviews are stored
 * - Cache refreshes once per 24 hours
 * - Minimal API usage by serving cached data when available
 * - Graceful error handling with fallback to stale cache
 */

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

// Maximum number of reviews to cache per place
const MAX_CACHED_REVIEWS = 10;

/**
 * SerpAPI response types for Google Maps Reviews
 * Based on actual SerpAPI response structure
 */
interface SerpAPIUser {
  name: string;
  link?: string;
  contributor_id?: string;
  thumbnail?: string;
  local_guide?: boolean;
  reviews?: number;
  photos?: number;
}

interface SerpAPIReview {
  link?: string;
  rating: number;
  date: string; // e.g., "před 4 dny"
  iso_date: string; // ISO date string
  iso_date_of_last_edit?: string;
  source?: string;
  review_id: string; // Unique review identifier
  user: SerpAPIUser;
  snippet?: string; // Review text
  extracted_snippet?: {
    original?: string;
  };
  details?: {
    [key: string]: string | undefined;
  };
}

interface SerpAPIResponse {
  reviews?: SerpAPIReview[];
  error?: string;
  search_metadata?: {
    id?: string;
    status?: string;
  };
  place_info?: {
    title?: string;
    address?: string;
    rating?: number;
    reviews?: number;
  };
}

/**
 * Extracts or resolves Google Place ID from various URL formats
 * 
 * Priority:
 * 1. GOOGLE_PLACE_ID env var (most reliable)
 * 2. Extract from standard Google Maps URLs (maps.google.com)
 * 3. Attempt to resolve share.google URLs (requires network call)
 * 
 * @param shareUrl - Google Maps share URL (e.g., https://share.google/pGYEZetdodfFNv1U7)
 * @returns Promise<string> - The Google Place ID
 */
async function extractPlaceId(shareUrl: string): Promise<string> {
  // First, check if place ID is directly provided via env var
  const envPlaceId = process.env.GOOGLE_PLACE_ID;
  if (envPlaceId) {
    return envPlaceId;
  }

  // Handle share.google URLs - these need to be resolved to get the actual Maps URL
  if (shareUrl.includes('share.google')) {
    try {
      // Follow redirects to get the actual Google Maps URL
      const response = await fetch(shareUrl, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      const finalUrl = response.url;
      
      // Extract place ID from the resolved URL
      // Google Maps URLs can have place IDs in formats like:
      // - ?cid=...&place_id=...
      // - /place/.../@.../data=...
      const placeIdMatch = finalUrl.match(/[?&]place_id=([^&]+)/) || 
                          finalUrl.match(/\/place\/([^\/]+)/);
      
      if (placeIdMatch && placeIdMatch[1]) {
        return decodeURIComponent(placeIdMatch[1]);
      }
    } catch (error) {
      console.error('Error resolving share.google URL:', error);
      throw new Error('Failed to extract place ID from share URL. Please set GOOGLE_PLACE_ID env var.');
    }
  }

  // Handle standard Google Maps URLs
  const placeIdMatch = shareUrl.match(/[?&]place_id=([^&]+)/) || 
                       shareUrl.match(/\/place\/([^\/]+)/);
  
  if (placeIdMatch && placeIdMatch[1]) {
    return decodeURIComponent(placeIdMatch[1]);
  }

  throw new Error('Could not extract place ID from URL. Please set GOOGLE_PLACE_ID env var.');
}

/**
 * Fetches Google Maps reviews from SerpAPI and caches them in the database
 * 
 * This function:
 * - Checks the database first for cached reviews
 * - Only calls SerpAPI if cache is missing or stale (> 24 hours)
 * - Normalizes and upserts reviews into Prisma
 * - Ensures only the 10 latest reviews are kept
 * - Updates the fetchedAt timestamp
 * 
 * @param placeId - Google Place ID
 * @returns Promise<number> - Number of reviews cached
 */
export async function fetchAndCacheGoogleReviews(placeId: string): Promise<number> {
  // Check database first before making API call
  const latestCache = await prisma.googleReviewCache.findFirst({
    where: { placeId },
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  const now = new Date();
  const cacheAge = latestCache 
    ? now.getTime() - latestCache.fetchedAt.getTime()
    : CACHE_DURATION_MS + 1; // Force refresh if no cache exists

  // If cache is fresh (< 24 hours), skip API call
  if (cacheAge < CACHE_DURATION_MS) {
    console.log(`Cache is fresh (age: ${Math.round(cacheAge / (60 * 60 * 1000))} hours). Skipping API call.`);
    const cachedReviews = await prisma.googleReviewCache.findMany({
      where: { placeId },
      orderBy: { reviewCreatedAt: 'desc' },
      take: MAX_CACHED_REVIEWS,
    });
    return cachedReviews.length;
  }

  // Support both SERPAPI_KEY (per spec) and SERPAPI (for compatibility)
  const serpApiKey = process.env.SERPAPI_KEY || process.env.SERPAPI;
  
  if (!serpApiKey) {
    throw new Error('SERPAPI_KEY or SERPAPI environment variable is not set');
  }

  try {
    console.log(`Cache is stale or missing (age: ${latestCache ? Math.round(cacheAge / (60 * 60 * 1000)) : 'N/A'} hours). Fetching reviews for place ID: ${placeId}`);

    // Fetch reviews from SerpAPI using the serpapi package
    const data: SerpAPIResponse = await new Promise((resolve, reject) => {
      getJson(
        {
          api_key: serpApiKey,
          engine: 'google_maps_reviews',
          place_id: placeId,
          sort_by: 'newestFirst',
        },
        (json) => {
          if (json.error) {
            reject(new Error(`SerpAPI error: ${json.error}`));
          } else {
            resolve(json as SerpAPIResponse);
          }
        }
      );
    });

    // Handle SerpAPI errors
    if (data.error) {
      throw new Error(`SerpAPI error: ${data.error}`);
    }

    // Validate response structure
    if (!data.reviews || !Array.isArray(data.reviews)) {
      throw new Error('Invalid SerpAPI response: reviews array not found');
    }

    const reviews = data.reviews;
    console.log(`Received ${reviews.length} reviews from SerpAPI`);

    // Process and upsert reviews
    const now = new Date();
    let cachedCount = 0;

    for (const review of reviews) {
      try {
        // Normalize review data from actual SerpAPI response structure
        const reviewId = review.review_id;
        if (!reviewId) {
          console.warn('Skipping review without review_id');
          continue;
        }

        const authorName = review.user?.name || 'Anonymous';
        const rating = Math.max(1, Math.min(5, Math.round(review.rating || 0))); // Clamp 1-5
        
        // Extract review text from snippet or extracted_snippet
        const text = review.snippet || review.extracted_snippet?.original || null;
        
        const relativeTime = review.date || 'Unknown';
        const reviewLink = review.link || null;
        const source = review.source || null;
        
        // Parse ISO date string to Date object
        let reviewCreatedAt: Date;
        try {
          reviewCreatedAt = review.iso_date 
            ? new Date(review.iso_date)
            : new Date(); // Fallback to now if date missing
        } catch {
          console.warn(`Invalid ISO date for review ${reviewId}, using current date`);
          reviewCreatedAt = new Date();
        }

        // Upsert review using review_id as unique identifier
        await prisma.googleReviewCache.upsert({
          where: {
            reviewId,
          },
          create: {
            placeId,
            reviewId,
            authorName,
            rating,
            text,
            relativeTime,
            reviewCreatedAt,
            reviewLink,
            source,
            fetchedAt: now,
          },
          update: {
            authorName,
            rating,
            text,
            relativeTime,
            reviewCreatedAt,
            reviewLink,
            source,
            fetchedAt: now,
          },
        });

        cachedCount++;
      } catch (error) {
        // Log individual review errors but continue processing others
        console.error('Error caching individual review:', error);
      }
    }

    // Remove older reviews beyond the limit
    // Get all reviews for this place, ordered by reviewCreatedAt descending
    const allReviews = await prisma.googleReviewCache.findMany({
      where: { placeId },
      orderBy: { reviewCreatedAt: 'desc' },
      select: { id: true },
    });

    // If we have more than MAX_CACHED_REVIEWS, delete the oldest ones
    if (allReviews.length > MAX_CACHED_REVIEWS) {
      const reviewsToDelete = allReviews.slice(MAX_CACHED_REVIEWS);
      const idsToDelete = reviewsToDelete.map(r => r.id);

      await prisma.googleReviewCache.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      });

      console.log(`Deleted ${idsToDelete.length} older reviews to maintain limit of ${MAX_CACHED_REVIEWS}`);
    }

    console.log(`Successfully cached ${cachedCount} reviews for place ${placeId}`);
    return cachedCount;
  } catch (error) {
    console.error('Error fetching and caching Google reviews:', error);
    throw error;
  }
}

/**
 * Gets cached Google Maps reviews, refreshing if cache is older than 24 hours
 * 
 * Behavior:
 * - Checks the most recent fetchedAt timestamp
 * - If cache is younger than 24 hours, returns cached reviews
 * - If cache is older than 24 hours or doesn't exist, refreshes via SerpAPI
 * - Always returns exactly the 10 latest reviews
 * - Falls back to stale cache if SerpAPI fails
 * 
 * @param placeId - Google Place ID (optional, will extract from env/share URL if not provided)
 * @returns Promise<Array> - Array of cached review objects
 */
export async function getCachedGoogleReviews(placeId?: string): Promise<Array<{
  id: string;
  placeId: string;
  authorName: string;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewCreatedAt: Date;
  fetchedAt: Date;
}>> {
  // Resolve place ID if not provided
  let resolvedPlaceId = placeId;
  
  if (!resolvedPlaceId) {
    const shareUrl = 'https://share.google/pGYEZetdodfFNv1U7';
    resolvedPlaceId = await extractPlaceId(shareUrl);
  }

  try {
    // Check if we have cached reviews and when they were last fetched
    const latestCache = await prisma.googleReviewCache.findFirst({
      where: { placeId: resolvedPlaceId },
      orderBy: { fetchedAt: 'desc' },
      select: { fetchedAt: true },
    });

    const now = new Date();
    const cacheAge = latestCache 
      ? now.getTime() - latestCache.fetchedAt.getTime()
      : CACHE_DURATION_MS + 1; // Force refresh if no cache exists

    const needsRefresh = cacheAge >= CACHE_DURATION_MS;

    if (needsRefresh) {
      console.log(`Cache is ${Math.round(cacheAge / (60 * 60 * 1000))} hours old. Refreshing...`);
      
      try {
        // Attempt to refresh cache
        await fetchAndCacheGoogleReviews(resolvedPlaceId);
        console.log('Cache refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh cache:', error);
        
        // If refresh fails but we have stale cache, use it
        if (latestCache) {
          console.log('Falling back to stale cache');
        } else {
          // No cache exists and refresh failed - rethrow error
          throw new Error(`Failed to fetch reviews and no cache exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } else {
      console.log(`Using cached reviews (age: ${Math.round(cacheAge / (60 * 60 * 1000))} hours)`);
    }

    // Fetch and return the latest reviews (up to MAX_CACHED_REVIEWS)
    const reviews = await prisma.googleReviewCache.findMany({
      where: { placeId: resolvedPlaceId },
      orderBy: { reviewCreatedAt: 'desc' },
      take: MAX_CACHED_REVIEWS,
    });

    return reviews;
  } catch (error) {
    console.error('Error getting cached Google reviews:', error);
    throw error;
  }
}

/**
 * Utility function to get the Google Place ID from the configured share URL
 * This can be used to initialize the place ID for the first time
 * 
 * @returns Promise<string> - The resolved Google Place ID
 */
export async function getGooglePlaceId(): Promise<string> {
  const shareUrl = 'https://share.google/pGYEZetdodfFNv1U7';
  return extractPlaceId(shareUrl);
}
