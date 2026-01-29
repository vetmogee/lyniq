import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// Example admin API route
export async function GET() {
  try {
    const user = await requireAuth();
    
    return NextResponse.json({
      message: 'Admin API endpoint',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
