import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    await requireAuth();

    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Image group name is required' },
        { status: 400 }
      );
    }

    const imageGroup = await prisma.imageGroup.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ imageGroup });
  } catch (error) {
    console.error('Error updating image group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update image group';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    await requireAuth();

    await prisma.imageGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete image group';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
