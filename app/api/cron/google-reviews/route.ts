import { NextResponse } from 'next/server';
import { refreshGoogleReviews } from '@/lib/google-reviews';

/**
 * Daily cron job (see vercel.json): calls SerpAPI and stores the reviews
 * and the datetime of the call in Global Config.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` with every cron request.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lastFetchedAt } = await refreshGoogleReviews();
    return NextResponse.json({ ok: true, lastFetchedAt });
  } catch (error) {
    console.error('Error refreshing Google reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh reviews';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
