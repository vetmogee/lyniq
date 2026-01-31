import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is authenticated (for API routes - doesn't redirect)
 * @returns user if authenticated, null otherwise
 */
export async function checkAuth() {
  return await getUser();
}

/**
 * Require authentication, redirecting to login if not authenticated
 * Use this in page components and layouts
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/admin');
  }
  return user;
}

/**
 * Sign out and redirect to login page
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin');
}
