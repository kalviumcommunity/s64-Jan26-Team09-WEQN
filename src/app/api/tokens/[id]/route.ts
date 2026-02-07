import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tokens/[id]
 * Fetch a single token by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock data
    const mockToken = {
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
      doctor: {
        name: 'Dr. Smith',
        department: 'General Medicine',
        roomNumber: 'Room 101',
      },
    };

    if (id !== 'tok_001') {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: mockToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tokens/[id]
 * Update token status
 * Body: { status: 'CALLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate status
    const validStatuses = ['WAITING', 'CALLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status', validStatuses },
        { status: 400 }
      );
    }

    if (id !== 'tok_001') {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    // Mock update
    const updatedToken = {
      id: 'tok_001',
      tokenNumber: 'DOC-T001',
      patientName: 'John Doe',
      patientPhone: '+919876543210',
      doctorId: 'doc_001',
      status: body.status,
      position: body.status === 'CALLED' ? 0 : 1,
      joinedAt: new Date().toISOString(),
      calledAt: body.status === 'CALLED' ? new Date().toISOString() : null,
      completedAt: body.status === 'COMPLETED' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Token status updated successfully',
        data: updatedToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tokens/[id]
 * Cancel a token (patient leaves queue)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (id !== 'tok_001') {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Token cancelled successfully. Patient removed from queue.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
