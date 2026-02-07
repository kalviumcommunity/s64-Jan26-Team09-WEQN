import { z } from 'zod';

/**
 * Doctor Validation Schemas
 * Used for validating doctor-related API requests
 */

// Create doctor schema
export const createDoctorSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    department: z.string().min(2, 'Department must be at least 2 characters'),
    specialization: z.string().optional(),
    roomNumber: z.string().optional(),
    avgConsultationMinutes: z.number().int().positive('Avg consultation time must be positive').default(10),
    isAvailable: z.boolean().default(true),
});

// Update doctor schema (all fields optional)
export const updateDoctorSchema = z.object({
    department: z.string().min(2, 'Department must be at least 2 characters').optional(),
    specialization: z.string().optional(),
    roomNumber: z.string().optional(),
    avgConsultationMinutes: z.number().int().positive('Avg consultation time must be positive').optional(),
    isAvailable: z.boolean().optional(),
});

// Export types
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
