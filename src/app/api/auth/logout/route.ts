import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const requestId = request.headers.get('x-request-id') || undefined;

    const response = NextResponse.json(
        {
            success: true,
            message: 'Logged out',
            data: {
                requestId,
            },
        },
        { status: 200 }
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

