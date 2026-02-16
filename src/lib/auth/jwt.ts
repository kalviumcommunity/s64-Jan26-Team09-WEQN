import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import type { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set in production');
    }
}

export interface JWTPayload {
    id: string;
    email: string;
    role: Role;
}

export function generateToken(payload: JWTPayload): string {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Extract JWT token from Authorization header
 * @param request - Next.js request object
 * @returns Token string or null
 */
export function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return null;
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}

/**
 * Verify request has valid JWT token
 * @param request - Next.js request object
 * @returns Decoded payload or null if invalid/missing
 */
export function authenticateRequest(request: NextRequest): JWTPayload | null {
    const token = extractToken(request);

    if (!token) {
        return null;
    }

    return verifyToken(token);
}
