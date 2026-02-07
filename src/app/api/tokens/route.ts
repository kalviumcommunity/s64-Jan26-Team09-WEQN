import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tokens
 * Fetch all queue tokens with pagination and filters
 * Query params: ?page=1&limit=10&doctorId=doc_001&status=WAITING
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
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
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedTokens = filteredTokens.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        success: true,
        data: paginatedTokens,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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

    // Validate required fields
    if (!body.patientName || !body.patientPhone || !body.doctorId) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['patientName', 'patientPhone', 'doctorId'],
        },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(body.patientPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Mock token creation
    const newToken = {
      id: `tok_${Date.now()}`,
      tokenNumber: `DOC-T${String(Date.now()).slice(-3)}`,
      patientId: body.patientId || null,
      patientName: body.patientName,
      patientPhone: body.patientPhone,
      doctorId: body.doctorId,
      status: 'WAITING',
      position: 3, // Mock position
      joinedAt: new Date().toISOString(),
      estimatedWaitMinutes: 45, // Mock ETA
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Token created successfully. Patient added to queue.',
        data: newToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
