/**
 * Centralized Error Code Registry
 * 
 * Purpose: Provide consistent, machine-readable error codes across all API endpoints
 * for monitoring, logging, and frontend error handling.
 * 
 * Format: E[Category][Number]
 * - E0xx: Validation errors
 * - E1xx: Authentication/Authorization errors
 * - E2xx: Resource errors (not found, conflict)
 * - E3xx: Database/External service errors
 * - E4xx: Business logic errors
 * - E5xx: Internal server errors
 */

export const ERROR_CODES = {
  // Validation Errors (E0xx)
  VALIDATION_ERROR: 'E001',
  INVALID_INPUT: 'E002',
  MISSING_REQUIRED_FIELD: 'E003',
  INVALID_EMAIL_FORMAT: 'E004',
  INVALID_PHONE_FORMAT: 'E005',
  INVALID_PAGINATION: 'E006',
  INVALID_QUERY_PARAMS: 'E007',

  // Authentication/Authorization Errors (E1xx)
  UNAUTHORIZED: 'E101',
  FORBIDDEN: 'E102',
  INVALID_TOKEN: 'E103',
  TOKEN_EXPIRED: 'E104',
  INSUFFICIENT_PERMISSIONS: 'E105',

  // Resource Errors (E2xx)
  NOT_FOUND: 'E201',
  RESOURCE_NOT_FOUND: 'E202',
  USER_NOT_FOUND: 'E203',
  DOCTOR_NOT_FOUND: 'E204',
  TOKEN_NOT_FOUND: 'E205',
  ALREADY_EXISTS: 'E206',
  DUPLICATE_ENTRY: 'E207',

  // Database/External Service Errors (E3xx)
  DATABASE_ERROR: 'E301',
  DATABASE_CONNECTION_FAILED: 'E302',
  QUERY_FAILED: 'E303',
  TRANSACTION_FAILED: 'E304',
  EXTERNAL_SERVICE_ERROR: 'E305',
  CACHE_ERROR: 'E306',

  // Business Logic Errors (E4xx)
  DOCTOR_NOT_AVAILABLE: 'E401',
  QUEUE_FULL: 'E402',
  INVALID_STATUS_TRANSITION: 'E403',
  OPERATION_NOT_ALLOWED: 'E404',
  BUSINESS_RULE_VIOLATION: 'E405',

  // Internal Server Errors (E5xx)
  INTERNAL_ERROR: 'E500',
  UNHANDLED_ERROR: 'E501',
  SERVICE_UNAVAILABLE: 'E503',
} as const;

// Type for error codes
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Error code descriptions for logging and monitoring
export const ERROR_DESCRIPTIONS: Record<ErrorCode, string> = {
  // Validation
  E001: 'Validation error - Input data failed validation rules',
  E002: 'Invalid input - Provided data is malformed or incorrect',
  E003: 'Missing required field - One or more required fields are missing',
  E004: 'Invalid email format - Email address format is incorrect',
  E005: 'Invalid phone format - Phone number format is incorrect',
  E006: 'Invalid pagination - Page or limit parameters are invalid',
  E007: 'Invalid query parameters - Query string parameters are malformed',

  // Authentication/Authorization
  E101: 'Unauthorized - Authentication required',
  E102: 'Forbidden - Insufficient permissions to access resource',
  E103: 'Invalid token - Authentication token is invalid',
  E104: 'Token expired - Authentication token has expired',
  E105: 'Insufficient permissions - User lacks required permissions',

  // Resource
  E201: 'Not found - Requested resource does not exist',
  E202: 'Resource not found - Specific resource could not be located',
  E203: 'User not found - User with specified ID does not exist',
  E204: 'Doctor not found - Doctor with specified ID does not exist',
  E205: 'Token not found - Queue token with specified ID does not exist',
  E206: 'Already exists - Resource with same identifier already exists',
  E207: 'Duplicate entry - Attempting to create duplicate resource',

  // Database/External
  E301: 'Database error - Database operation failed',
  E302: 'Database connection failed - Unable to connect to database',
  E303: 'Query failed - Database query execution failed',
  E304: 'Transaction failed - Database transaction could not be completed',
  E305: 'External service error - Third-party service request failed',
  E306: 'Cache error - Cache operation failed',

  // Business Logic
  E401: 'Doctor not available - Selected doctor is not accepting patients',
  E402: 'Queue full - Doctor queue has reached maximum capacity',
  E403: 'Invalid status transition - Cannot change status to requested value',
  E404: 'Operation not allowed - Requested operation is not permitted',
  E405: 'Business rule violation - Operation violates business rules',

  // Internal
  E500: 'Internal server error - An unexpected error occurred',
  E501: 'Unhandled error - An unhandled exception occurred',
  E503: 'Service unavailable - Service is temporarily unavailable',
};

/**
 * Get error description by code
 */
export function getErrorDescription(code: ErrorCode): string {
  return ERROR_DESCRIPTIONS[code] || 'Unknown error';
}

/**
 * Check if error code is a validation error
 */
export function isValidationError(code: ErrorCode): boolean {
  return code.startsWith('E0');
}

/**
 * Check if error code is an authentication error
 */
export function isAuthError(code: ErrorCode): boolean {
  return code.startsWith('E1');
}

/**
 * Check if error code is a resource error
 */
export function isResourceError(code: ErrorCode): boolean {
  return code.startsWith('E2');
}

/**
 * Check if error code is a server error
 */
export function isServerError(code: ErrorCode): boolean {
  return code.startsWith('E5');
}
