import { z } from 'zod';

/**
 * Token Validation Schemas
 * Used for validating queue token-related API requests
 */

// Create token schema (join queue)
export const createTokenSchema = z.object({
    patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
    patientPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
    patientId: z.string().uuid('Invalid patient ID format').optional(),
    doctorId: z.string().uuid('Invalid doctor ID format'),
});

// Update token schema
export const updateTokenSchema = z.object({
    status: z.enum(['WAITING', 'CALLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
        errorMap: () => ({ message: 'Invalid status value' }),
    }).optional(),
    position: z.number().int().nonnegative().optional(),
});

// Export types
export type CreateTokenInput = z.infer<typeof createTokenSchema>;
export type UpdateTokenInput = z.infer<typeof updateTokenSchema>;
