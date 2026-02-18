import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { serviceGroupName, serviceGroupDescription, services } = body;

    if (!serviceGroupName || !services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'Service group name and at least one service are required' },
        { status: 400 }
      );
    }

    // Get the next position for the service group
    const maxPosition = await prisma.serviceGroup.findFirst({
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const nextPosition = (maxPosition?.position ?? -1) + 1;

    // Create service group with services
    const serviceGroup = await prisma.serviceGroup.create({
      data: {
        name: serviceGroupName,
        description: serviceGroupDescription || null,
        position: nextPosition,
        services: {
          create: services.map((service: { name: string; price: number; description?: string; duration?: number | null; position?: number }, index: number) => ({
            name: service.name,
            price: parseFloat(service.price.toString()),
            description: service.description || null,
            duration: service.duration ?? null,
            position: service.position ?? index,
          })),
        },
      },
      include: {
        services: true,
      },
    });

    return NextResponse.json({ serviceGroup }, { status: 201 });
  } catch (error) {
    console.error('Error creating service group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create service group';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAuth();

    const serviceGroups = await prisma.serviceGroup.findMany({
      include: {
        services: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });

    // Also get services without a group (for backward compatibility)
    const ungroupedServices = await prisma.service.findMany({
      where: {
        serviceGroupId: null,
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ serviceGroups, ungroupedServices });
  } catch (error) {
    console.error('Error fetching service groups:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch service groups';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
