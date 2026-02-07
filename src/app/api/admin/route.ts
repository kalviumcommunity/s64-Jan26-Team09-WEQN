import { NextRequest, NextResponse } from 'next/server';
import { sendSuccess } from '@/lib/responseHandler';

/**
 * GET /api/admin
 * Admin-only dashboard endpoint
 * Requires ADMIN role (enforced by middleware)
 */
export async function GET(request: NextRequest) {
    // User info is attached by middleware
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');

    return sendSuccess(
        {
            message: 'Welcome to the Admin Dashboard!',
            admin: {
                id: userId,
                email: userEmail,
                role: userRole,
            },
            access: {
                canManageUsers: true,
                canManageDoctors: true,
                canViewAllTokens: true,
                canManageSettings: true,
            },
        },
        'Admin access granted'
    );
}

/**
 * POST /api/admin
 * Example admin action - system configuration
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const userEmail = request.headers.get('x-user-email');

        // Mock admin action
        return sendSuccess(
            {
                message: 'Admin action executed successfully',
                action: body.action || 'system_config_update',
                executedBy: userEmail,
                timestamp: new Date().toISOString(),
            },
            'Configuration updated'
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to execute admin action',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
