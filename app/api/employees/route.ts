import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, title, photo, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Employee name is required' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        photo: photo?.trim() || null,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAuth();

    const employees = await prisma.employee.findMany({
      include: {
        images: {
          where: {
            imageGroupId: null,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
