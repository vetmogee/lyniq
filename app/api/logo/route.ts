import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch the logo (there should only be one)
    const logos = await prisma.logo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (logos.length === 0) {
      return NextResponse.json(
        { 
          error: 'Logo not found',
          details: 'No logo has been uploaded to the database yet.'
        },
        { status: 404 }
      );
    }

    const logo = logos[0];

    return NextResponse.json({ logo });
  } catch (error) {
    console.error('Unexpected error in GET /api/logo:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const errorInfo = handlePrismaError(error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch logo',
        details: errorInfo.message,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: errorInfo.status }
    );
  }
}
