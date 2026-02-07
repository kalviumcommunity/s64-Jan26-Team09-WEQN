import { NextRequest } from 'next/server';
import {
  sendSuccess,
  sendNotFoundError,
  sendValidationError,
  sendInternalError,
  sendNoContent,
} from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

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
      return sendNotFoundError('User', `User with ID ${id} does not exist`);
    }

    return sendSuccess(mockUser, 'User fetched successfully');
  } catch (error) {
    console.error('Error fetching user:', error);
    return sendInternalError(
      'Failed to fetch user',
      error instanceof Error ? error.message : undefined
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
      return sendValidationError(
        'No fields provided for update',
        'At least one field must be provided to update'
      );
    }

    // Simulate user not found
    if (id !== 'usr_001') {
      return sendNotFoundError('User', `User with ID ${id} does not exist`);
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

    return sendSuccess(updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof SyntaxError) {
      return sendValidationError(
        'Invalid JSON in request body',
        error.message
      );
    }

    return sendInternalError(
      'Failed to update user',
      error instanceof Error ? error.message : undefined
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
      return sendNotFoundError('User', `User with ID ${id} does not exist`);
    }

    // Mock deletion - Replace with actual database soft delete
    return sendSuccess(undefined, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return sendInternalError(
      'Failed to delete user',
      error instanceof Error ? error.message : undefined
    );
  }
}
