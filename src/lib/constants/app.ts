/**
 * Application Constants
 */

export const APP_NAME = 'Digital Queue Management System';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'A serverless, cloud-native queue management system for hospitals';

/**
 * User Roles
 */
export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Token Status
 */
export const TOKEN_STATUS = {
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type TokenStatus = typeof TOKEN_STATUS[keyof typeof TOKEN_STATUS];

/**
 * API Routes
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },
  QUEUE: {
    JOIN: '/api/queue/join',
    LEAVE: '/api/queue/leave',
    POSITION: '/api/queue/position',
    CALL_NEXT: '/api/queue/call-next',
    COMPLETE: '/api/queue/complete',
  },
  ADMIN: {
    DOCTORS: '/api/admin/doctors',
    QUEUES: '/api/admin/queues',
    ANALYTICS: '/api/admin/analytics',
  },
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

/**
 * Time Constants (in milliseconds)
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_LENGTH: 10,
} as const;
