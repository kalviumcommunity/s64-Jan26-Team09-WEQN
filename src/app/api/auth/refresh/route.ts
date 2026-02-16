import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateAccessToken, verifyRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const requestId = request.headers.get('x-request-id') || undefined;

    try {
        const refreshToken = request.cookies.get('refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Authentication failed',
                    error: {
                        code: 'E401',
                        requestId,
                    },
                },
                { status: 401 }
            );
        }

        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: 'Authentication failed',
                    error: {
                        code: 'E401',
                        requestId,
                    },
                },
                { status: 401 }
            );

            response.cookies.set('auth_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 0,
            });

            response.cookies.set('refresh_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 0,
            });

            return response;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: 'Authentication failed',
                    error: {
                        code: 'E401',
                        requestId,
                    },
                },
                { status: 401 }
            );

            response.cookies.set('auth_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 0,
            });

            response.cookies.set('refresh_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 0,
            });

            return response;
        }

        const newAccessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json(
            {
                success: true,
                message: 'Token refreshed',
                data: {
                    accessToken: newAccessToken,
                },
            },
            { status: 200 }
        );

        response.cookies.set('auth_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60,
        });

        return response;
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: {
                    code: 'E500',
                    requestId,
                },
            },
            { status: 500 }
        );
    }
}

