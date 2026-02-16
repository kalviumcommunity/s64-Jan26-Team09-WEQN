import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

export interface AuthTokenPayload {
    id: string;
    email: string;
    role: Role;
}

const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const accessTokenExpiry = process.env.JWT_EXPIRY || '15m';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

function assertSecret(secret: string | undefined, name: string) {
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`${name} is not configured`);
        }
    }
}

export function generateAccessToken(payload: AuthTokenPayload): string {
    assertSecret(accessTokenSecret, 'JWT_SECRET');
    return (jwt as any).sign(payload, accessTokenSecret as string, {
        expiresIn: accessTokenExpiry,
    });
}

export function verifyAccessToken(token: string): AuthTokenPayload | null {
    try {
        assertSecret(accessTokenSecret, 'JWT_SECRET');
        const decoded = jwt.verify(token, accessTokenSecret as string) as AuthTokenPayload;
        return decoded;
    } catch {
        return null;
    }
}

export function generateRefreshToken(payload: AuthTokenPayload): string {
    assertSecret(refreshTokenSecret, 'REFRESH_TOKEN_SECRET');
    return (jwt as any).sign(payload, refreshTokenSecret as string, {
        expiresIn: refreshTokenExpiry,
    });
}

export function verifyRefreshToken(token: string): AuthTokenPayload | null {
    try {
        assertSecret(refreshTokenSecret, 'REFRESH_TOKEN_SECRET');
        const decoded = jwt.verify(token, refreshTokenSecret as string) as AuthTokenPayload;
        return decoded;
    } catch {
        return null;
    }
}
