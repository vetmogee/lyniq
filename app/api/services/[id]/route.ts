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
    const { name, description, price, duration, position, serviceGroupId } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Service name and price are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      description: description || null,
      price: parseFloat(price.toString()),
      duration: duration ? parseInt(duration.toString()) : 60,
      serviceGroupId: serviceGroupId || null,
    };

    if (position !== undefined) {
      updateData.position = parseInt(position.toString());
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error('Error updating service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update service';
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

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete service';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
