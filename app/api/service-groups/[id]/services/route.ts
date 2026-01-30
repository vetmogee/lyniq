import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    await requireAuth();

    const body = await request.json();
    const { name, description, price, duration, position } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Service name and price are required' },
        { status: 400 }
      );
    }

    // Verify service group exists
    const serviceGroup = await prisma.serviceGroup.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: { position: 'desc' },
          take: 1,
          select: { position: true },
        },
      },
    });

    if (!serviceGroup) {
      return NextResponse.json(
        { error: 'Service group not found' },
        { status: 404 }
      );
    }

    // Determine position - use provided position or next available
    const nextPosition = position !== undefined 
      ? parseInt(position.toString())
      : ((serviceGroup.services[0]?.position ?? -1) + 1);

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price.toString()),
        duration: duration ? parseInt(duration.toString()) : 60,
        position: nextPosition,
        serviceGroupId: id,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create service';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
