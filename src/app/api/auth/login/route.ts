import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { generateToken } from '@/lib/auth/jwt';
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
            return sendNotFoundError('User', 'No account found with this email');
        }

        // Check if account is active
        if (!user.isActive) {
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
            return sendUnauthorizedError(
                'Invalid credentials',
                'Email or password is incorrect'
            );
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Assignment 2.42: Secure Cookie Configuration
        // Create response and set secure, httpOnly, sameSite cookie
        const response = sendSuccess(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            'Login successful'
        );

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600, // 1 hour
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return sendValidationError(
                'Validation failed',
                error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
            );
        }

        return sendInternalError(
            'Login failed',
            error instanceof Error ? error.message : undefined
        );
    }
}
