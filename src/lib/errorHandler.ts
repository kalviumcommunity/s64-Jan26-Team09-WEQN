import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Centralized Error Handler
 * 
 * Provides consistent error handling across all API routes:
 * - Logs full error details for debugging
 * - Returns safe, minimal messages in production
 * - Maintains structured error format for frontend consumption
 */

/**
 * Error classification types
 */
export enum ErrorType {
    VALIDATION = 'ValidationError',
    AUTHENTICATION = 'AuthenticationError',
    AUTHORIZATION = 'AuthorizationError',
    NOT_FOUND = 'NotFoundError',
    CONFLICT = 'ConflictError',
    INTERNAL = 'InternalError',
}

/**
 * Custom application error with type classification
 */
export class AppError extends Error {
    type: ErrorType;
    statusCode: number;
    isOperational: boolean; // true for expected errors, false for programming errors

    constructor(
        message: string,
        type: ErrorType = ErrorType.INTERNAL,
        statusCode: number = 500,
        isOperational: boolean = true
    ) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Main error handler function
 * 
 * @param error - Error object (can be Error, AppError, or any)
 * @param context - Context string describing where error occurred (e.g., "GET /api/users")
 * @param requestId - Optional request ID for log correlation
 * @returns NextResponse with formatted error
 */
export function handleError(error: any, context: string, requestId?: string): NextResponse {
    const isProd = process.env.NODE_ENV === 'production';

    // Determine error type and status code
    let statusCode = 500;
    let errorType = ErrorType.INTERNAL;
    let message = 'Something went wrong. Please try again later.';

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorType = error.type;
        message = isProd && !error.isOperational
            ? 'Something went wrong. Please try again later.'
            : error.message;
    } else if (error instanceof Error) {
        message = isProd ? 'Something went wrong. Please try again later.' : error.message;
    }

    // Prepare error response (safe for production)
    const errorResponse: any = {
        success: false,
        message,
        error: {
            type: errorType,
            code: `E${statusCode}`,
            requestId, // Include requestId in response for client-side support/debugging
        },
    };

    // Include stack trace only in development
    if (!isProd && error.stack) {
        errorResponse.stack = error.stack;
    }

    // Log full error details (always logged, even in production)
    logger.error(`Error in ${context}`, error, {
        requestId,
        type: errorType,
        statusCode,
        isOperational: error instanceof AppError ? error.isOperational : false,
    });

    return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Helper functions to create specific error types
 */

export function createValidationError(message: string): AppError {
    return new AppError(message, ErrorType.VALIDATION, 400);
}

export function createAuthenticationError(message: string = 'Authentication required'): AppError {
    return new AppError(message, ErrorType.AUTHENTICATION, 401);
}

export function createAuthorizationError(message: string = 'Access denied'): AppError {
    return new AppError(message, ErrorType.AUTHORIZATION, 403);
}

export function createNotFoundError(resource: string): AppError {
    return new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404);
}

export function createConflictError(message: string): AppError {
    return new AppError(message, ErrorType.CONFLICT, 409);
}

/**
 * Example usage:
 * 
 * try {
 *   const user = await prisma.user.findUnique({ where: { id } });
 *   if (!user) throw createNotFoundError('User');
 *   
 *   if (user.email === body.email) {
 *     throw createConflictError('Email already in use');
 *   }
 *   
 *   return sendSuccess(user);
 * } catch (error) {
 *   return handleError(error, 'GET /api/users/[id]');
 * }
 */
