import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Authenticate user
    try {
      await requireAuth();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: authError instanceof Error ? authError.message : 'Please log in to view images'
        },
        { status: 401 }
      );
    }

    // Validate image ID
    if (!id || !id.trim()) {
      return NextResponse.json(
        { 
          error: 'Invalid image ID',
          details: 'Image ID is required and cannot be empty.'
        },
        { status: 400 }
      );
    }

    // Fetch image
    let image;
    try {
      image = await prisma.image.findUnique({
        where: { id },
      });
    } catch (dbError) {
      console.error('Database error while fetching image:', dbError);
      const errorInfo = handlePrismaError(dbError);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: errorInfo.message
        },
        { status: errorInfo.status }
      );
    }

    if (!image) {
      return NextResponse.json(
        { 
          error: 'Image not found',
          details: `No image found with ID "${id}".`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Unexpected error in GET /api/images/[id]:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch image',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Authenticate user
    try {
      await requireAuth();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: authError instanceof Error ? authError.message : 'Please log in to update images'
        },
        { status: 401 }
      );
    }

    // Validate image ID
    if (!id || !id.trim()) {
      return NextResponse.json(
        { 
          error: 'Invalid image ID',
          details: 'Image ID is required and cannot be empty.'
        },
        { status: 400 }
      );
    }

    // Parse request body
    let body: { title?: string; description?: string; order?: number; imageGroupId?: string | null; employeeId?: string | null };
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: 'Failed to parse JSON request body. Please ensure the request contains valid JSON.'
        },
        { status: 400 }
      );
    }

    const { title, description, order, imageGroupId, employeeId } = body;

    // Validate that image doesn't belong to both gallery and employee
    if (imageGroupId !== undefined && employeeId !== undefined && imageGroupId && employeeId) {
      return NextResponse.json(
        { 
          error: 'Invalid relation',
          details: 'An image can belong to either a gallery (imageGroupId) or an employee (employeeId), but not both.'
        },
        { status: 400 }
      );
    }

    // Validate order if provided
    if (order !== undefined && (typeof order !== 'number' || order < 0)) {
      return NextResponse.json(
        { 
          error: 'Invalid order value',
          details: 'Order must be a non-negative number.'
        },
        { status: 400 }
      );
    }

    // Verify relations exist if provided
    if (imageGroupId !== undefined && imageGroupId) {
      try {
        const imageGroup = await prisma.imageGroup.findUnique({
          where: { id: imageGroupId },
        });
        if (!imageGroup) {
          return NextResponse.json(
            { 
              error: 'Image group not found',
              details: `No image group found with ID "${imageGroupId}". Please verify the image group exists.`
            },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error while checking image group:', dbError);
        const errorInfo = handlePrismaError(dbError);
        return NextResponse.json(
          { 
            error: 'Database error',
            details: errorInfo.message
          },
          { status: errorInfo.status }
        );
      }
    }

    if (employeeId !== undefined && employeeId) {
      try {
        const employee = await prisma.employee.findUnique({
          where: { id: employeeId },
        });
        if (!employee) {
          return NextResponse.json(
            { 
              error: 'Employee not found',
              details: `No employee found with ID "${employeeId}". Please verify the employee exists.`
            },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error while checking employee:', dbError);
        const errorInfo = handlePrismaError(dbError);
        return NextResponse.json(
          { 
            error: 'Database error',
            details: errorInfo.message
          },
          { status: errorInfo.status }
        );
      }
    }

    const updateData: {
      title?: string | null;
      description?: string | null;
      order?: number;
      imageGroupId?: string | null;
      employeeId?: string | null;
    } = {};

    if (title !== undefined) updateData.title = title?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (order !== undefined) updateData.order = order;
    if (imageGroupId !== undefined) updateData.imageGroupId = imageGroupId || null;
    if (employeeId !== undefined) updateData.employeeId = employeeId || null;

    // Check if image exists and update
    let image;
    try {
      // First check if image exists
      const existingImage = await prisma.image.findUnique({
        where: { id },
      });

      if (!existingImage) {
        return NextResponse.json(
          { 
            error: 'Image not found',
            details: `No image found with ID "${id}". Please verify the image exists.`
          },
          { status: 404 }
        );
      }

      image = await prisma.image.update({
        where: { id },
        data: updateData,
      });
    } catch (dbError) {
      console.error('Database error while updating image:', dbError);
      const errorInfo = handlePrismaError(dbError);
      return NextResponse.json(
        { 
          error: 'Failed to update image',
          details: errorInfo.message,
          imageId: id
        },
        { status: errorInfo.status }
      );
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Unexpected error in PUT /api/images/[id]:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to update image',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
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

    // Authenticate user
    try {
      await requireAuth();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: authError instanceof Error ? authError.message : 'Please log in to delete images'
        },
        { status: 401 }
      );
    }

    // Validate image ID
    if (!id || !id.trim()) {
      return NextResponse.json(
        { 
          error: 'Invalid image ID',
          details: 'Image ID is required and cannot be empty.'
        },
        { status: 400 }
      );
    }

    // Check if image exists before deleting
    try {
      const existingImage = await prisma.image.findUnique({
        where: { id },
      });

      if (!existingImage) {
        return NextResponse.json(
          { 
            error: 'Image not found',
            details: `No image found with ID "${id}". The image may have already been deleted.`
          },
          { status: 404 }
        );
      }

      await prisma.image.delete({
        where: { id },
      });
    } catch (dbError) {
      console.error('Database error while deleting image:', dbError);
      const errorInfo = handlePrismaError(dbError);
      return NextResponse.json(
        { 
          error: 'Failed to delete image',
          details: errorInfo.message,
          imageId: id
        },
        { status: errorInfo.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/images/[id]:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to delete image',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}
