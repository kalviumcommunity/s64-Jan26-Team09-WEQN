import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/jwt';
import {
    sendSuccess,
    sendUnauthorizedError,
    sendForbiddenError,
} from '@/lib/responseHandler';
import { logger } from '@/lib/logger';

type RoleString = 'ADMIN' | 'DOCTOR' | 'PATIENT';

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
        logger.warn('Unauthorized access attempt', {
            route: request.nextUrl.pathname,
            method: request.method,
        });

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
    allowedRoles: RoleString[]
) {
    const authResult = await requireAuth(request);

    if (authResult.error) {
        return authResult;
    }

    const { user } = authResult;

    if (!allowedRoles.includes(user.role as RoleString)) {
        logger.warn('Forbidden access attempt', {
            route: request.nextUrl.pathname,
            method: request.method,
            role: user.role,
            allowedRoles,
        });

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
