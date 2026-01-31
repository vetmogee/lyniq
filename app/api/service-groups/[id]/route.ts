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
    const { name, description, position } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Service group name is required' },
        { status: 400 }
      );
    }

    const updateData: {
      name: string;
      description: string | null;
      position?: number;
    } = {
      name,
      description: description || null,
    };

    if (position !== undefined) {
      updateData.position = parseInt(position.toString());
    }

    const serviceGroup = await prisma.serviceGroup.update({
      where: { id },
      data: updateData,
      include: {
        services: true,
      },
    });

    return NextResponse.json({ serviceGroup }, { status: 200 });
  } catch (error) {
    console.error('Error updating service group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update service group';
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

    await prisma.serviceGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting service group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete service group';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
