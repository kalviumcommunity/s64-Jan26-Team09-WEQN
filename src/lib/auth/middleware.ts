import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/jwt';
import {
    sendSuccess,
    sendUnauthorizedError,
    sendForbiddenError,
} from '@/lib/responseHandler';

/**
 * Authentication middleware for protected routes
 * Verifies JWT token from Authorization header
 * 
 * @param request - Next.js request object
 * @returns User payload if authenticated, or error response
 * 
 * Usage example:
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const authResult = await requireAuth(request);
 *   if (authResult.error) return authResult.error;
 *   
 *   const user = authResult.user;
 *   // ... proceed with authenticated logic
 * }
 * ```
 */
export async function requireAuth(request: NextRequest) {
    const user = authenticateRequest(request);

    if (!user) {
        return {
            error: sendUnauthorizedError(
                'Authentication required',
                'Please provide a valid token in Authorization header'
            ),
        };
    }

    return { user };
}

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role
 * 
 * @param request - Next.js request object
 * @param allowedRoles - Array of allowed roles
 * @returns User payload if authorized, or error response
 */
export async function requireRole(
    request: NextRequest,
    allowedRoles: string[]
) {
    const authResult = await requireAuth(request);

    if (authResult.error) {
        return authResult;
    }

    const { user } = authResult;

    if (!allowedRoles.includes(user.role)) {
        return {
            error: sendForbiddenError(
                'Insufficient permissions',
                `This action requires one of the following roles: ${allowedRoles.join(', ')}`
            ),
        };
    }

    return { user };
}

/**
 * Example protected route
 * GET /api/auth/me
 * Returns current user info from JWT token
 */
export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult.error) {
        return authResult.error;
    }

    const { user } = authResult;

    return sendSuccess(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        'User authenticated successfully'
    );
}
