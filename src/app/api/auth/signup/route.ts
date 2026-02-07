import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db/prisma';
import { createUserSchema } from '@/lib/validators/user';
import { ZodError } from 'zod';
import {
    sendCreated,
    sendValidationError,
    sendInternalError,
} from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

/**
 * POST /api/auth/signup
 * Register a new user with secure password hashing
 * Body: { email, password, name, phone?, role? }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input with Zod
        const validatedData = createUserSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User already exists',
                    error: {
                        code: ERROR_CODES.ALREADY_EXISTS,
                        details: 'An account with this email already exists',
                    },
                },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (10 salt rounds)
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash,
                name: validatedData.name,
                phone: validatedData.phone,
                role: validatedData.role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        return sendCreated(newUser, 'Signup successful');
    } catch (error) {
        console.error('Signup error:', error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return sendValidationError(
                'Validation failed',
                error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
            );
        }

        // Handle Prisma errors
        if (error instanceof Error && 'code' in error) {
            const prismaError = error as any;
            if (prismaError.code === 'P2002') {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'User already exists',
                        error: { code: ERROR_CODES.DUPLICATE_ENTRY },
                    },
                    { status: 409 }
                );
            }
        }

        return sendInternalError(
            'Signup failed',
            error instanceof Error ? error.message : undefined
        );
    }
}
