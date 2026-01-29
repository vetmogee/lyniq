import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await testDatabaseConnection();
    
    if (result.success) {
      return NextResponse.json(
        { 
          status: 'healthy',
          message: result.message,
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          message: result.message,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to test database connection',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
