import { z } from 'zod';

/**
 * User Validation Schemas
 * Used for validating user-related API requests
 */

// Create user schema
export const createUserSchema = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    phone: z.string().trim().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format').optional(),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN'], {
        errorMap: () => ({ message: 'Role must be PATIENT, DOCTOR, or ADMIN' }),
    }).default('PATIENT'),
}).strict();

// Update user schema (all fields optional)
export const updateUserSchema = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().trim().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format').optional(),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
}).strict();

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
