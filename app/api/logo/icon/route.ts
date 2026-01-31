import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getImageDataUrl } from '@/lib/image-utils';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Fetch the logo (there should only be one)
    const logos = await prisma.logo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (logos.length === 0) {
      // Fallback to static file
      return serveStaticFile();
    }

    const logo = logos[0];
    const dataUrl = getImageDataUrl(logo.data);

    if (!dataUrl) {
      return serveStaticFile();
    }

    // Parse the data URL to get the base64 data and mime type
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return serveStaticFile();
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/logo/icon:', error);
    
    // Fallback to static file
    return serveStaticFile();
  }
}

function serveStaticFile() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'lyniq.svg');
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to serve static logo file:', error);
    return new NextResponse('Logo not found', { status: 404 });
  }
}
