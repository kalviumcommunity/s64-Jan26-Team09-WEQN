import { NextRequest, NextResponse } from 'next/server';
import { sendSuccess } from '@/lib/responseHandler';
import { requireRole } from '@/lib/auth/middleware';

/**
 * GET /api/admin
 * Admin-only dashboard endpoint
 * Requires ADMIN role
 */
export async function GET(request: NextRequest) {
    const authResult = await requireRole(request, ['ADMIN']);

    if ('error' in authResult) {
        return authResult.error;
    }

    const { user } = authResult;

    return sendSuccess(
        {
            message: 'Welcome to the Admin Dashboard!',
            admin: {
                id: user.id,
                email: user.email,
                role: user.role,
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
    const authResult = await requireRole(request, ['ADMIN']);

    if ('error' in authResult) {
        return authResult.error;
    }

    try {
        const body = await request.json();
        const { user } = authResult;

        // Mock admin action
        return sendSuccess(
            {
                message: 'Admin action executed successfully',
                action: body.action || 'system_config_update',
                executedBy: user.email,
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
