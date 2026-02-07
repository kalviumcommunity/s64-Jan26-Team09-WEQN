import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

/**
 * JWT Configuration
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '1h'; // Token expires in 1 hour

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
    id: string;
    email: string;
    role: string;
}

/**
 * Generate JWT token for authenticated user
 * @param payload - User data to encode in token
 * @returns Signed JWT token string
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
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
