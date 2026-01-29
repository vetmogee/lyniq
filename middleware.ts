import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only process admin routes, skip Supabase for public routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  // If env vars are missing, allow access but log warning (for development)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Supabase environment variables not configured. Admin routes may not work properly.');
    // Allow access to login page even without Supabase configured
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    // Redirect other admin routes to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean; httpOnly?: boolean }) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: { path?: string; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean; httpOnly?: boolean }) {
          request.cookies.set(name, '');
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh session and get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle /admin root path
  if (request.nextUrl.pathname === '/admin') {
    if (user) {
      // If logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      // If not logged in, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow access to login page
  if (request.nextUrl.pathname === '/admin/login') {
    // If already logged in, redirect to dashboard
    if (user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return response;
  }

  // Require authentication for all other admin routes
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
