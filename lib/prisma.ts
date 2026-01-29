import { PrismaClient, Prisma } from '@prisma/client';

// Prisma Client singleton pattern for Next.js
// Prevents multiple instances in development

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Validate database connection environment variables
function validateDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please check your .env.local file and ensure DATABASE_URL is configured.'
    );
  }

  if (!directUrl) {
    throw new Error(
      'DIRECT_URL environment variable is not set. ' +
      'Please check your .env.local file and ensure DIRECT_URL is configured.'
    );
  }

  // Basic URL format validation
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    throw new Error(
      'DATABASE_URL must be a valid PostgreSQL connection string. ' +
      'Expected format: postgresql://user:password@host:port/database?schema=public'
    );
  }
}

// Initialize Prisma Client with connection validation
let prismaInstance: PrismaClient;

try {
  validateDatabaseConfig();
  
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw error;
}

export const prisma = prismaInstance;

// Helper function to handle Prisma errors with detailed messages
export function handlePrismaError(error: unknown): { message: string; status: number } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P1001':
        return {
          message: 'Database connection failed. Cannot reach the database server. Please check your DATABASE_URL and ensure the database is running.',
          status: 503,
        };
      case 'P1002':
        return {
          message: 'Database connection timeout. The database server took too long to respond.',
          status: 503,
        };
      case 'P1003':
        return {
          message: 'Database does not exist. Please check your DATABASE_URL and ensure the database name is correct.',
          status: 500,
        };
      case 'P1008':
        return {
          message: 'Database operation timed out. The query took too long to execute.',
          status: 504,
        };
      case 'P1011':
        return {
          message: 'TLS connection error. Please check your database connection settings.',
          status: 500,
        };
      case 'P1017':
        return {
          message: 'Database server closed the connection. This may be due to connection limits or server restart.',
          status: 503,
        };
      case 'P2002':
        return {
          message: `Unique constraint violation: ${error.meta?.target ? JSON.stringify(error.meta.target) : 'field'} already exists.`,
          status: 409,
        };
      case 'P2025':
        return {
          message: `Record not found: ${error.meta?.cause || 'The requested record does not exist.'}`,
          status: 404,
        };
      default:
        return {
          message: `Database error (${error.code}): ${error.message}`,
          status: 500,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      message: `Database initialization error: ${error.message}. Please check your DATABASE_URL and DIRECT_URL environment variables.`,
      status: 500,
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: `Database validation error: ${error.message}`,
      status: 400,
    };
  }

  if (error instanceof Error) {
    // Check for connection-related errors
    if (error.message.includes('ECONNREFUSED')) {
      return {
        message: 'Database connection refused. Please check if the database server is running and the connection details are correct.',
        status: 503,
      };
    }
    if (error.message.includes('ENOTFOUND')) {
      return {
        message: 'Database host not found. Please check your DATABASE_URL and ensure the hostname is correct.',
        status: 503,
      };
    }
    if (error.message.includes('authentication')) {
      return {
        message: 'Database authentication failed. Please check your DATABASE_URL credentials.',
        status: 401,
      };
    }
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: 'An unknown database error occurred.',
    status: 500,
  };
}

// Test database connection
export async function testDatabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    const errorInfo = handlePrismaError(error);
    return { success: false, message: errorInfo.message };
  }
}
