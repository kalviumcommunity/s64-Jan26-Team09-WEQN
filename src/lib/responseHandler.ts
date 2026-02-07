/**
 * Global API Response Handler
 * 
 * Purpose: Enforce a consistent response envelope across all API endpoints
 * to ensure predictable frontend integration, robust error handling, and
 * observable API behavior for monitoring and debugging.
 * 
 * Design Principles:
 * 1. Single Response Contract - All responses follow the same structure
 * 2. Type Safety - Full TypeScript support for response shapes
 * 3. Observability - Include timestamps and error codes for monitoring
 * 4. Developer Experience - Simple, intuitive API for route handlers
 */

import { NextResponse } from 'next/server';
import { ERROR_CODES, type ErrorCode, getErrorDescription } from './errorCodes';

/**
 * Standard API Response Envelope
 * This structure is returned by ALL API endpoints
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: ErrorCode;
    details?: string;
  };
  timestamp: string;
  pagination?: PaginationMeta;
}

/**
 * Pagination metadata for collection endpoints
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * HTTP Status Code mapping for common scenarios
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Success Response Handler
 * 
 * @param data - Response payload (optional)
 * @param message - Success message (default: "Success")
 * @param status - HTTP status code (default: 200)
 * @param pagination - Pagination metadata for collection endpoints
 * @returns NextResponse with standardized success envelope
 * 
 * @example
 * return sendSuccess({ id: 1, name: "John" }, "User created", 201);
 * 
 * @example
 * return sendSuccess(users, "Users fetched", 200, paginationMeta);
 */
export function sendSuccess<T = any>(
  data?: T,
  message: string = 'Success',
  status: number = HTTP_STATUS.OK,
  pagination?: PaginationMeta
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };

  // Only include data if provided
  if (data !== undefined) {
    response.data = data;
  }

  // Include pagination metadata if provided
  if (pagination) {
    response.pagination = pagination;
  }

  // Log success for monitoring (in production, send to logging service)
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Success]', {
      message,
      status,
      timestamp: response.timestamp,
      hasData: data !== undefined,
      hasPagination: pagination !== undefined,
    });
  }

  return NextResponse.json(response, { status });
}

/**
 * Error Response Handler
 * 
 * @param message - Error message for the user
 * @param errorCode - Machine-readable error code from ERROR_CODES
 * @param status - HTTP status code (default: 500)
 * @param details - Additional error details for debugging (optional)
 * @returns NextResponse with standardized error envelope
 * 
 * @example
 * return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
 * 
 * @example
 * return sendError(
 *   "Validation failed",
 *   ERROR_CODES.VALIDATION_ERROR,
 *   400,
 *   "Email format is invalid"
 * );
 */
export function sendError(
  message: string,
  errorCode: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: string
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  };

  // Log error for monitoring (in production, send to Sentry/Datadog)
  console.error('[API Error]', {
    message,
    errorCode,
    status,
    details,
    timestamp: response.timestamp,
    description: getErrorDescription(errorCode),
  });

  return NextResponse.json(response, { status });
}

/**
 * Validation Error Helper
 * Convenience function for validation errors (400)
 * 
 * @param message - Validation error message
 * @param details - Specific validation failure details
 * @returns NextResponse with validation error
 * 
 * @example
 * return sendValidationError("Invalid input", "Email is required");
 */
export function sendValidationError(
  message: string = 'Validation failed',
  details?: string
): NextResponse<ApiResponse> {
  return sendError(
    message,
    ERROR_CODES.VALIDATION_ERROR,
    HTTP_STATUS.BAD_REQUEST,
    details
  );
}

/**
 * Not Found Error Helper
 * Convenience function for 404 errors
 * 
 * @param resource - Name of the resource that wasn't found
 * @param details - Additional details
 * @returns NextResponse with not found error
 * 
 * @example
 * return sendNotFoundError("User");
 */
export function sendNotFoundError(
  resource: string = 'Resource',
  details?: string
): NextResponse<ApiResponse> {
  return sendError(
    `${resource} not found`,
    ERROR_CODES.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    details
  );
}

/**
 * Unauthorized Error Helper
 * Convenience function for 401 errors
 * 
 * @param message - Unauthorized message
 * @param details - Additional details
 * @returns NextResponse with unauthorized error
 * 
 * @example
 * return sendUnauthorizedError("Invalid token");
 */
export function sendUnauthorizedError(
  message: string = 'Unauthorized',
  details?: string
): NextResponse<ApiResponse> {
  return sendError(
    message,
    ERROR_CODES.UNAUTHORIZED,
    HTTP_STATUS.UNAUTHORIZED,
    details
  );
}

/**
 * Forbidden Error Helper
 * Convenience function for 403 errors
 * 
 * @param message - Forbidden message
 * @param details - Additional details
 * @returns NextResponse with forbidden error
 * 
 * @example
 * return sendForbiddenError("Insufficient permissions");
 */
export function sendForbiddenError(
  message: string = 'Forbidden',
  details?: string
): NextResponse<ApiResponse> {
  return sendError(
    message,
    ERROR_CODES.FORBIDDEN,
    HTTP_STATUS.FORBIDDEN,
    details
  );
}

/**
 * Internal Server Error Helper
 * Convenience function for 500 errors
 * 
 * @param message - Error message
 * @param details - Additional details (stack trace in dev)
 * @returns NextResponse with internal server error
 * 
 * @example
 * return sendInternalError("Database connection failed");
 */
export function sendInternalError(
  message: string = 'Internal server error',
  details?: string
): NextResponse<ApiResponse> {
  return sendError(
    message,
    ERROR_CODES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details
  );
}

/**
 * Created Response Helper
 * Convenience function for 201 responses
 * 
 * @param data - Created resource data
 * @param message - Success message
 * @returns NextResponse with created status
 * 
 * @example
 * return sendCreated(newUser, "User created successfully");
 */
export function sendCreated<T = any>(
  data: T,
  message: string = 'Resource created successfully'
): NextResponse<ApiResponse<T>> {
  return sendSuccess(data, message, HTTP_STATUS.CREATED);
}

/**
 * No Content Response Helper
 * Convenience function for 204 responses (typically for DELETE)
 * 
 * @param message - Success message
 * @returns NextResponse with no content status
 * 
 * @example
 * return sendNoContent("User deleted successfully");
 */
export function sendNoContent(
  message: string = 'Resource deleted successfully'
): NextResponse<ApiResponse> {
  return sendSuccess(undefined, message, HTTP_STATUS.NO_CONTENT);
}

/**
 * Paginated Response Helper
 * Convenience function for paginated collection responses
 * 
 * @param data - Array of items
 * @param pagination - Pagination metadata
 * @param message - Success message
 * @returns NextResponse with paginated data
 * 
 * @example
 * return sendPaginated(users, {
 *   page: 1,
 *   limit: 10,
 *   total: 100,
 *   totalPages: 10,
 *   hasNext: true,
 *   hasPrev: false
 * });
 */
export function sendPaginated<T = any>(
  data: T[],
  pagination: PaginationMeta,
  message: string = 'Data fetched successfully'
): NextResponse<ApiResponse<T[]>> {
  return sendSuccess(data, message, HTTP_STATUS.OK, pagination);
}

/**
 * Error Handler Wrapper
 * Wraps async route handlers with try-catch and automatic error responses
 * 
 * @param handler - Async route handler function
 * @returns Wrapped handler with error handling
 * 
 * @example
 * export const GET = withErrorHandler(async (request) => {
 *   const data = await fetchData();
 *   return sendSuccess(data);
 * });
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[Unhandled Error]', error);
      
      // In development, include stack trace
      const details = process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.stack
        : undefined;

      return sendInternalError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        details
      );
    }
  }) as T;
}

/**
 * Calculate pagination metadata
 * Helper function to generate pagination object
 * 
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata object
 * 
 * @example
 * const pagination = calculatePagination(1, 10, 100);
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
