import { NextRequest } from 'next/server';
import {
  sendSuccess,
  sendValidationError,
  sendInternalError,
  sendCreated,
  calculatePagination,
} from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

/**
 * GET /api/users
 * Fetch all users with pagination
 * Query params: ?page=1&limit=10&role=PATIENT
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return sendValidationError(
        'Invalid pagination parameters',
        'Page must be >= 1, limit must be between 1-100'
      );
    }

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
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const { createUserSchema } = await import('@/lib/validators/user');
    const { ZodError } = await import('zod');

    const validatedData = createUserSchema.parse(body);

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
