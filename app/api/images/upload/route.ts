import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    try {
      await requireAuth();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: authError instanceof Error ? authError.message : 'Please log in to upload images'
        },
        { status: 401 }
      );
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      console.error('Error parsing form data:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: 'Failed to parse form data. Please ensure the request is a valid multipart/form-data request.'
        },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { 
          error: 'No file provided',
          details: 'Please select a file to upload. The file field is required.'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type',
          details: `File type "${file.type}" is not allowed. Only JPEG, PNG, WebP, and GIF images are allowed.`,
          allowedTypes: allowedTypes
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for base64 storage - base64 increases size by ~33%)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: 'File size too large',
          details: `File size is ${fileSizeMB}MB. Maximum allowed size is 10MB for database storage.`,
          fileSize: file.size,
          maxSize: maxSize
        },
        { status: 400 }
      );
    }

    // Get optional relation parameters
    const imageGroupId = formData.get('imageGroupId') as string | null;
    const employeeId = formData.get('employeeId') as string | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const order = formData.get('order') ? parseInt(formData.get('order') as string) : 0;

    // Validate that image belongs to either a gallery or employee, but not both
    if (imageGroupId && employeeId) {
      return NextResponse.json(
        { 
          error: 'Invalid relation',
          details: 'An image can belong to either a gallery (imageGroupId) or an employee (employeeId), but not both.'
        },
        { status: 400 }
      );
    }

    // Convert file to base64 string
    let base64Data: string;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = buffer.toString('base64');
    } catch (bufferError) {
      console.error('Error converting file to base64:', bufferError);
      return NextResponse.json(
        { 
          error: 'File conversion error',
          details: 'Failed to convert the file to base64. The file may be corrupted or inaccessible.'
        },
        { status: 400 }
      );
    }

    // Create JSON string with image data
    const imageDataJson = JSON.stringify({
      data: base64Data,
      mimeType: file.type,
      filename: file.name,
    });

    // Verify relations exist if provided
    if (imageGroupId) {
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

    if (employeeId) {
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

    // Save image to database
    let image;
    try {
      image = await prisma.image.create({
        data: {
          data: imageDataJson,
          mimeType: file.type,
          filename: file.name,
          title: title?.trim() || null,
          description: description?.trim() || null,
          order: order || 0,
          imageGroupId: imageGroupId || null,
          employeeId: employeeId || null,
        },
      });
    } catch (dbError) {
      console.error('Database error while creating image:', dbError);
      const errorInfo = handlePrismaError(dbError);
      return NextResponse.json(
        { 
          error: 'Failed to save image',
          details: errorInfo.message
        },
        { status: errorInfo.status }
      );
    }

    return NextResponse.json({ 
      id: image.id,
      mimeType: image.mimeType,
      filename: image.filename,
      title: image.title,
      description: image.description,
      order: image.order,
      imageGroupId: image.imageGroupId,
      employeeId: image.employeeId,
      createdAt: image.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in upload route:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}
