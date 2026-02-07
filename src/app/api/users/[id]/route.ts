import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/[id]
 * Fetch a single user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock data - Replace with actual database query
    const mockUser = {
      id: 'usr_001',
      email: 'patient@example.com',
      name: 'John Doe',
      phone: '+919876543210',
      role: 'PATIENT',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // Simulate user not found
    if (id !== 'usr_001') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: mockUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Update a user partially
 * Body: { name?, phone?, isActive? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate that at least one field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Simulate user not found
    if (id !== 'usr_001') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mock updated user - Replace with actual database update
    const updatedUser = {
      id: 'usr_001',
      email: 'patient@example.com',
      name: body.name || 'John Doe',
      phone: body.phone || '+919876543210',
      role: 'PATIENT',
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user (soft delete - set isActive to false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Simulate user not found
    if (id !== 'usr_001') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mock deletion - Replace with actual database soft delete
    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
