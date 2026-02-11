import { NextRequest } from 'next/server';
import {
  sendSuccess,
  sendValidationError,
  sendCreated,
  sendInternalError,
  calculatePagination,
} from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { sanitize } from '@/lib/sanitize';

/**
 * GET /api/tokens
 * Fetch all queue tokens with pagination and filters
 * Query params: ?page=1&limit=10&doctorId=doc_001&status=WAITING
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Sanitize query parameters
    const query = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      doctorId: searchParams.get('doctorId'),
      status: searchParams.get('status'),
    };
    const sanitizedQuery = sanitize(query);

    const page = parseInt(sanitizedQuery.page);
    const limit = parseInt(sanitizedQuery.limit);
    const doctorId = sanitizedQuery.doctorId;
    const status = sanitizedQuery.status;

    // Validate pagination
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      return sendValidationError(
        'Invalid pagination parameters',
        'Page must be >= 1, limit must be between 1-100'
      );
    }


    // Validate status if provided
    const validStatuses = ['WAITING', 'CALLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return sendValidationError(
        'Invalid status parameter',
        `Status must be one of: ${validStatuses.join(', ')}`
      );
    }

    // Mock data
    const mockTokens = [
      {
        id: 'tok_001',
        tokenNumber: 'DOC-T001',
        patientId: 'usr_001',
        patientName: 'John Doe',
        patientPhone: '+919876543210',
        doctorId: 'doc_001',
        status: 'WAITING',
        position: 1,
        joinedAt: new Date().toISOString(),
        estimatedWaitMinutes: 15,
      },
      {
        id: 'tok_002',
        tokenNumber: 'DOC-T002',
        patientId: 'usr_004',
        patientName: 'Jane Smith',
        patientPhone: '+919876543213',
        doctorId: 'doc_001',
        status: 'CALLED',
        position: 0,
        joinedAt: new Date().toISOString(),
        calledAt: new Date().toISOString(),
        estimatedWaitMinutes: 0,
      },
    ];

    // Apply filters
    let filteredTokens = mockTokens;

    if (doctorId) {
      filteredTokens = filteredTokens.filter((token) => token.doctorId === doctorId);
    }

    if (status) {
      filteredTokens = filteredTokens.filter((token) => token.status === status);
    }

    // Pagination
    const total = filteredTokens.length;
    const startIndex = (page - 1) * limit;
    const paginatedTokens = filteredTokens.slice(startIndex, startIndex + limit);

    const pagination = calculatePagination(page, limit, total);

    return sendSuccess(
      paginatedTokens,
      'Tokens fetched successfully',
      200,
      pagination
    );
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return sendInternalError(
      'Failed to fetch tokens',
      error instanceof Error ? error.message : undefined
    );
  }
}

/**
 * POST /api/tokens
 * Create a new queue token (patient joins queue)
 * Body: { patientName, patientPhone, doctorId, patientId? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize input body
    const sanitizedBody = sanitize(body);

    // Validate with Zod after sanitization
    const { createTokenSchema } = await import('@/lib/validators/token');
    const { ZodError } = await import('zod');

    const validatedData = createTokenSchema.parse(sanitizedBody);

    // Mock token creation
    const newToken = {
      id: `tok_${Date.now()}`,
      tokenNumber: `DOC-T${String(Date.now()).slice(-3)}`,
      patientId: validatedData.patientId || null,
      patientName: validatedData.patientName,
      patientPhone: validatedData.patientPhone,
      doctorId: validatedData.doctorId,
      status: 'WAITING',
      position: 3, // Mock position
      joinedAt: new Date().toISOString(),
      estimatedWaitMinutes: 45, // Mock ETA
    };

    return sendCreated(newToken, 'Token created successfully. Patient added to queue.');
  } catch (error) {
    console.error('Error creating token:', error);

    // Handle Zod validation errors
    const { ZodError } = await import('zod');
    if (error instanceof ZodError) {
      return sendValidationError(
        'Validation failed',
        error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      );
    }

    if (error instanceof SyntaxError) {
      return sendValidationError(
        'Invalid JSON in request body',
        error.message
      );
    }

    return sendInternalError(
      'Failed to create token',
      error instanceof Error ? error.message : undefined
    );
  }
}
