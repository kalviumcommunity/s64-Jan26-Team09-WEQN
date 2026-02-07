import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uploadFileSchema } from '@/lib/validators/upload';
import { prisma } from '@/lib/db/prisma';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    // Get user from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    // Fallback for local development if middleware is bypassed or headers missing
    // In production, middleware ensures this header is present for protected routes
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: User ID missing' }, 
        { status: 401 }
      );
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = uploadFileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          error: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const { filename, contentType, size } = validation.data;
    const key = `uploads/${userId}/${Date.now()}-${filename}`;

    // Generate Presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });

    // Store pending document in DB
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const document = await (prisma as any).document.create({
      data: {
        filename,
        mimeType: contentType,
        size,
        url: publicUrl,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: presignedUrl,
        documentId: document.id,
        publicUrl,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
