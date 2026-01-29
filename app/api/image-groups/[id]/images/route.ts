import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function POST(
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
          details: authError instanceof Error ? authError.message : 'Please log in to add images'
        },
        { status: 401 }
      );
    }

    // Validate image group ID
    if (!id || !id.trim()) {
      return NextResponse.json(
        { 
          error: 'Invalid image group ID',
          details: 'Image group ID is required and cannot be empty.'
        },
        { status: 400 }
      );
    }

    // Check if request is multipart/form-data (file upload) or JSON (base64 data)
    const contentType = request.headers.get('content-type') || '';
    let imageDataJson: string;
    let mimeType: string;
    let filename: string | null = null;
    let title: string | null = null;
    let description: string | null = null;
    let order: number = 0;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { 
            error: 'No file provided',
            details: 'Please provide a file to upload.'
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
            details: `File type "${file.type}" is not allowed. Only JPEG, PNG, WebP, and GIF images are allowed.`
          },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB for base64 storage)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return NextResponse.json(
          { 
            error: 'File size too large',
            details: `File size is ${fileSizeMB}MB. Maximum allowed size is 10MB.`
          },
          { status: 400 }
        );
      }

      // Convert file to base64
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        imageDataJson = JSON.stringify({
          data: base64Data,
          mimeType: file.type,
          filename: file.name,
        });
        mimeType = file.type;
        filename = file.name;
      } catch (bufferError) {
        console.error('Error converting file to base64:', bufferError);
        return NextResponse.json(
          { 
            error: 'File conversion error',
            details: 'Failed to convert the file to base64.'
          },
          { status: 400 }
        );
      }

      // Get optional fields from form data
      title = (formData.get('title') as string)?.trim() || null;
      description = (formData.get('description') as string)?.trim() || null;
      const orderStr = formData.get('order') as string | null;
      order = orderStr ? parseInt(orderStr) : 0;
    } else {
      // Handle JSON body with base64 data
      let body: { data?: string; mimeType?: string; filename?: string; title?: string; description?: string; order?: number };
      try {
        body = await request.json();
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return NextResponse.json(
          { 
            error: 'Invalid request format',
            details: 'Failed to parse JSON request body. Please provide either multipart/form-data with a file, or JSON with base64 data.'
          },
          { status: 400 }
        );
      }

      const { data: base64Data, mimeType: providedMimeType, filename: providedFilename } = body;

      if (!base64Data || !providedMimeType) {
        return NextResponse.json(
          { 
            error: 'Missing required fields',
            details: 'Please provide both "data" (base64 string) and "mimeType" in the request body.'
          },
          { status: 400 }
        );
      }

      // Validate mime type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(providedMimeType)) {
        return NextResponse.json(
          { 
            error: 'Invalid mime type',
            details: `Mime type "${providedMimeType}" is not allowed. Only JPEG, PNG, WebP, and GIF images are allowed.`
          },
          { status: 400 }
        );
      }

      imageDataJson = JSON.stringify({
        data: base64Data,
        mimeType: providedMimeType,
        filename: providedFilename || null,
      });
      mimeType = providedMimeType;
      filename = providedFilename || null;

      // Get optional fields from JSON body
      title = body.title?.trim() || null;
      description = body.description?.trim() || null;
      order = body.order ?? 0;
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

    // Verify image group exists
    let imageGroup;
    try {
      imageGroup = await prisma.imageGroup.findUnique({
        where: { id },
      });
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

    if (!imageGroup) {
      return NextResponse.json(
        { 
          error: 'Image group not found',
          details: `No image group found with ID "${id}". Please verify the image group exists.`
        },
        { status: 404 }
      );
    }

    // Create image record
    let image;
    try {
      image = await prisma.image.create({
        data: {
          data: imageDataJson,
          mimeType: mimeType,
          filename: filename,
          title: title,
          description: description,
          order: order,
          imageGroupId: id,
        },
      });
    } catch (dbError) {
      console.error('Database error while creating image:', dbError);
      const errorInfo = handlePrismaError(dbError);
      return NextResponse.json(
        { 
          error: 'Failed to create image',
          details: errorInfo.message,
          imageGroupId: id
        },
        { status: errorInfo.status }
      );
    }

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/image-groups/[id]/images:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to add image',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}
