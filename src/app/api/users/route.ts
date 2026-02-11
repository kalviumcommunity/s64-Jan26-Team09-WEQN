import { NextRequest } from 'next/server';
import {
  sendSuccess,
  sendValidationError,
  sendInternalError,
  sendCreated,
  calculatePagination,
} from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import {
  getCached,
  setCached,
  generateCacheKey,
  invalidateCachePattern,
} from '@/lib/utils/cache';
import { sanitize } from '@/lib/sanitize';

/**
 * GET /api/users
 * Fetch all users with pagination
 * Query params: ?page=1&limit=10&role=PATIENT
 * 
 * Assignment 2.23: Caching Layer with Redis
 * Cache strategy: Store user lists with 30-second TTL
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Sanitize query parameters
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      role: searchParams.get('role'),
    };
    const sanitizedQuery = sanitize(queryParams);

    const page = parseInt(sanitizedQuery.page);
    const limit = parseInt(sanitizedQuery.limit);
    const role = sanitizedQuery.role;

    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      return sendValidationError(
        'Invalid pagination parameters',
        'Page must be >= 1, limit must be between 1-100'
      );
    }

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('users', {
      page,
      limit,
      role: role || undefined,
    });

    // ✅ Step 1: Check Redis cache first
    const cachedResponse = await getCached<any>(cacheKey);
    if (cachedResponse) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return sendSuccess(cachedResponse.data, cachedResponse.message, 200, cachedResponse.pagination);
    }
    console.log(`❌ Cache MISS: ${cacheKey}`);

    // Mock data - Replace with actual database query
    const mockUsers = [
      {
        id: 'usr_001',
        email: 'patient@example.com',
        name: 'John Doe',
        phone: '+919876543210',
        role: 'PATIENT',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_002',
        email: 'doctor@example.com',
        name: 'Dr. Smith',
        phone: '+919876543211',
        role: 'DOCTOR',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Filter by role if provided
    const filteredUsers = role
      ? mockUsers.filter((user) => user.role === role)
      : mockUsers;

    // Calculate pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const pagination = calculatePagination(page, limit, total);

    const responseData = {
      data: paginatedUsers,
      message: 'Users fetched successfully',
      pagination,
    };

    // ✅ Step 2: Cache the response for 30 seconds
    await setCached(cacheKey, responseData, 30);
    console.log(`💾 Cached response for 30s: ${cacheKey}`);

    return sendSuccess(
      paginatedUsers,
      'Users fetched successfully',
      200,
      pagination
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return sendInternalError(
      'Failed to fetch users',
      error instanceof Error ? error.message : undefined
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 * Body: { email, password, name, phone?, role }
 * 
 * Assignment 2.23: Cache Invalidation
 * When a user is created, clear all user-related cache entries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize input body
    const sanitizedBody = sanitize(body);

    // Validate with Zod after sanitization
    const { createUserSchema } = await import('@/lib/validators/user');
    const { ZodError } = await import('zod');

    const validatedData = createUserSchema.parse(sanitizedBody);

    // Mock user creation - Replace with actual database insert
    const newUser = {
      id: `usr_${Date.now()}`,
      email: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone || null,
      role: validatedData.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // ✅ Step 3: Invalidate user cache after write operation
    console.log('🔄 Invalidating user cache...');
    await invalidateCachePattern('users:*');
    console.log('✅ User cache cleared');

    return sendCreated(newUser, 'User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle Zod validation errors
    const { ZodError } = await import('zod');
    if (error instanceof ZodError) {
      return sendValidationError(
        'Validation failed',
        error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      );
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return sendValidationError(
        'Invalid JSON in request body',
        error.message
      );
    }

    return sendInternalError(
      'Failed to create user',
      error instanceof Error ? error.message : undefined
    );
  }
}
