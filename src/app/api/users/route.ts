import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100' },
        { status: 400 }
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
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        success: true,
        data: paginatedUsers,
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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

    // Validate required fields
    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['email', 'password', 'name', 'role'],
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['PATIENT', 'DOCTOR', 'ADMIN'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role', validRoles },
        { status: 400 }
      );
    }

    // Mock user creation - Replace with actual database insert
    const newUser = {
      id: `usr_${Date.now()}`,
      email: body.email,
      name: body.name,
      phone: body.phone || null,
      role: body.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
