import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * JWT Configuration
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * JWT Payload Interface
 */
interface JWTPayload {
    id: string;
    email: string;
    role: string;
}

/**
 * Protected route patterns and their required roles
 */
const PROTECTED_ROUTES = {
    '/api/admin': ['ADMIN'],
    '/api/users': ['ADMIN', 'DOCTOR', 'PATIENT'],
    '/api/doctors': ['ADMIN', 'DOCTOR'],
    '/api/tokens': ['ADMIN', 'DOCTOR', 'PATIENT'],
    '/api/email': ['ADMIN', 'DOCTOR', 'PATIENT'],
    '/api/uploads': ['ADMIN', 'DOCTOR', 'PATIENT'],
};

/**
 * Routes that bypass authentication
 */
const PUBLIC_ROUTES = [
    '/api/auth/signup',
    '/api/auth/login',
    '/api/health',
];

/**
 * Next.js Edge Middleware
 * Enforces Role-Based Access Control (RBAC) across API routes
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for public routes
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check if route requires protection
    const protectedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
        pathname.startsWith(route)
    );

    if (!protectedRoute) {
        // Route not explicitly protected, allow access
        return NextResponse.next();
    }

    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication required',
                error: {
                    code: 'E101',
                    details: 'Please provide a valid token in Authorization header',
                },
            },
            { status: 401 }
        );
    }

    try {
        // Verify JWT and decode payload
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        // Check role-based authorization
        const allowedRoles = PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES];

        if (!allowedRoles.includes(decoded.role)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Access denied',
                    error: {
                        code: 'E102',
                        details: `This endpoint requires one of the following roles: ${allowedRoles.join(', ')}`,
                    },
                },
                { status: 403 }
            );
        }

        // Attach user info to request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.id);
        requestHeaders.set('x-user-email', decoded.email);
        requestHeaders.set('x-user-role', decoded.role);

        // Allow request to proceed with user context
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        // Token verification failed (invalid or expired)
        return NextResponse.json(
            {
                success: false,
                message: 'Invalid or expired token',
                error: {
                    code: 'E103',
                    details: error instanceof Error ? error.message : 'Token verification failed',
                },
            },
            { status: 403 }
        );
    }
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
    matcher: [
        '/api/admin/:path*',
        '/api/users/:path*',
        '/api/doctors/:path*',
        '/api/tokens/:path*',
        '/api/email/:path*',
        '/api/uploads/:path*',
    ],
};
