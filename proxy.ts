import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip API, Next.js internals and files with an extension (e.g. favicon.ico, lyniq.mp4)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
