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
    const { name, title, photo, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Employee name is required' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        photo: photo?.trim() || null,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
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

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting employee:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
