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

    // Create service group with services
    const serviceGroup = await prisma.serviceGroup.create({
      data: {
        name: serviceGroupName,
        description: serviceGroupDescription || null,
        services: {
          create: services.map((service: { name: string; price: number; description?: string; duration?: number }) => ({
            name: service.name,
            price: parseFloat(service.price.toString()),
            description: service.description || null,
            duration: service.duration || 60,
            isActive: true,
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
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Also get services without a group (for backward compatibility)
    const ungroupedServices = await prisma.service.findMany({
      where: {
        serviceGroupId: null,
      },
      orderBy: { createdAt: 'desc' },
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
