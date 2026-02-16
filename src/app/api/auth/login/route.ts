import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import {
    sendSuccess,
    sendValidationError,
    sendInternalError,
    sendNotFoundError,
    sendUnauthorizedError,
} from '@/lib/responseHandler';

/**
 * Login schema validation
 */
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT token
 * Body: { email, password }
 */
export async function POST(request: NextRequest) {
    const requestId = request.headers.get('x-request-id') || undefined;
    
    try {
        const body = await request.json();

        // Validate input
        const validatedData = loginSchema.parse(body);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        if (!user) {
            logger.warn(`Login failed: User not found`, { email: validatedData.email, requestId });
            return sendNotFoundError('User', 'No account found with this email');
        }

        // Check if account is active
        if (!user.isActive) {
            logger.warn(`Login failed: Account deactivated`, { userId: user.id, requestId });
            return NextResponse.json(
                {
                    success: false,
                    message: 'Account is deactivated',
                    error: {
                        code: 'E405',
                        details: 'Please contact support to reactivate your account',
                    },
                },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid password`, { userId: user.id, requestId });
            return sendUnauthorizedError(
                'Invalid credentials',
                'Email or password is incorrect'
            );
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        logger.info(`Login successful`, { userId: user.id, role: user.role, requestId });

        const response = sendSuccess(
            {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            'Login successful'
        );

        response.cookies.set('auth_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60,
        });

        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        return handleError(error, 'POST /api/auth/login', requestId);
    }
}
