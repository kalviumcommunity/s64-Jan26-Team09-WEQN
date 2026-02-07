import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Format Zod validation errors into a consistent structure
 * @param error - ZodError instance from failed validation
 * @returns Formatted error object with field-level errors
 */
export function formatZodError(error: ZodError) {
    return {
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        })),
    };
}

/**
 * Create a validation error response
 * @param error - ZodError instance
 * @returns NextResponse with formatted validation errors
 */
export function validationErrorResponse(error: ZodError): NextResponse {
    return NextResponse.json(formatZodError(error), { status: 400 });
}
