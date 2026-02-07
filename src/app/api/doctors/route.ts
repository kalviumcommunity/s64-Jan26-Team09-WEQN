import { NextRequest, NextResponse } from 'next/server';
import {
  getCached,
  setCached,
  generateCacheKey,
  invalidateCachePattern,
} from '@/lib/utils/cache';

/**
 * GET /api/doctors
 * Fetch all doctors with pagination and filters
 * Query params: ?page=1&limit=10&department=Cardiology&available=true
 * 
 * Assignment 2.23: Caching Layer with Redis
 * Cache strategy: Store doctor lists with 60-second TTL
 * Cache invalidation: Triggered on doctor creation/updates
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const department = searchParams.get('department');
    const available = searchParams.get('available');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('doctors', {
      page,
      limit,
      department: department || undefined,
      available: available || undefined,
    });

    // ✅ Step 1: Check Redis cache first
    const cachedResponse = await getCached(cacheKey);
    if (cachedResponse) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return NextResponse.json(cachedResponse, { status: 200 });
    }
    console.log(`❌ Cache MISS: ${cacheKey}`);

    // Mock data - Replace with actual database query
    const mockDoctors = [
      {
        id: 'doc_001',
        userId: 'usr_002',
        department: 'General Medicine',
        specialization: 'Internal Medicine',
        roomNumber: 'Room 101',
        avgConsultationMinutes: 15,
        isAvailable: true,
        currentQueueCount: 5,
        user: {
          name: 'Dr. Smith',
          email: 'doctor@example.com',
          phone: '+919876543211',
        },
      },
      {
        id: 'doc_002',
        userId: 'usr_003',
        department: 'Cardiology',
        specialization: 'Heart Specialist',
        roomNumber: 'Room 202',
        avgConsultationMinutes: 20,
        isAvailable: false,
        currentQueueCount: 0,
        user: {
          name: 'Dr. Johnson',
          email: 'johnson@example.com',
          phone: '+919876543212',
        },
      },
    ];

    // Apply filters
    let filteredDoctors = mockDoctors;

    if (department) {
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.department.toLowerCase() === department.toLowerCase()
      );
    }

    if (available !== null) {
      const isAvailable = available === 'true';
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.isAvailable === isAvailable
      );
    }

    // Pagination
    const total = filteredDoctors.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + limit);

    const responseData = {
      success: true,
      data: paginatedDoctors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    // ✅ Step 2: Cache the response for 60 seconds
    await setCached(cacheKey, responseData, 60);
    console.log(`💾 Cached response for 60s: ${cacheKey}`);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/doctors
 * Create a new doctor profile
 * Body: { userId, department, specialization?, roomNumber?, avgConsultationMinutes? }
 * 
 * Assignment 2.23: Cache Invalidation
 * When a doctor is created, clear all doctor-related cache entries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const { createDoctorSchema } = await import('@/lib/validators/doctor');
    const { ZodError } = await import('zod');

    const validatedData = createDoctorSchema.parse(body);

    // Mock doctor creation
    const newDoctor = {
      id: `doc_${Date.now()}`,
      userId: validatedData.userId,
      department: validatedData.department,
      specialization: validatedData.specialization || null,
      roomNumber: validatedData.roomNumber || null,
      avgConsultationMinutes: validatedData.avgConsultationMinutes,
      isAvailable: validatedData.isAvailable,
      createdAt: new Date().toISOString(),
    };

    // ✅ Step 3: Invalidate doctor cache after write operation
    console.log('🔄 Invalidating doctor cache...');
    await invalidateCachePattern('doctors:*');
    console.log('✅ Doctor cache cleared');

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor profile created successfully',
        data: newDoctor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating doctor:', error);

    // Handle Zod validation errors
    const { ZodError } = await import('zod');
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
