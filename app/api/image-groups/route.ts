import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Image group name is required' },
        { status: 400 }
      );
    }

    const imageGroup = await prisma.imageGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ imageGroup }, { status: 201 });
  } catch (error) {
    console.error('Error creating image group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create image group';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAuth();

    const imageGroups = await prisma.imageGroup.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ imageGroups });
  } catch (error) {
    console.error('Error fetching image groups:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch image groups';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
