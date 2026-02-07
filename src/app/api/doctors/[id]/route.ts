import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/doctors/[id]
 * Fetch a single doctor by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock data
    const mockDoctor = {
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
    };

    if (id !== 'doc_001') {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: mockDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/doctors/[id]
 * Update doctor profile
 * Body: { department?, specialization?, roomNumber?, avgConsultationMinutes?, isAvailable? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    if (id !== 'doc_001') {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Mock update
    const updatedDoctor = {
      id: 'doc_001',
      userId: 'usr_002',
      department: body.department || 'General Medicine',
      specialization: body.specialization || 'Internal Medicine',
      roomNumber: body.roomNumber || 'Room 101',
      avgConsultationMinutes: body.avgConsultationMinutes || 15,
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor profile updated successfully',
        data: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/doctors/[id]
 * Delete doctor profile
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (id !== 'doc_001') {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor profile deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
