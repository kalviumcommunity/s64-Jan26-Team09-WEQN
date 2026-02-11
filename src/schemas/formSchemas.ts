import { z } from 'zod';

/**
 * Form Validation Schemas using Zod
 * Assignment 2.30: Form Handling & Validation
 * 
 * Centralized validation schemas for all forms in the application.
 * Provides type-safe validation and automatic TypeScript type inference.
 */

/**
 * Signup Form Schema
 * Used for user registration
 */
export const signupSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase(),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must not exceed 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Contact Form Schema
 * Used for general contact/inquiry forms
 */
export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must not exceed 50 characters'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase(),

    subject: z
        .string()
        .min(5, 'Subject must be at least 5 characters long')
        .max(100, 'Subject must not exceed 100 characters')
        .optional(),

    message: z
        .string()
        .min(10, 'Message must be at least 10 characters long')
        .max(1000, 'Message must not exceed 1000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Token Request Form Schema
 * Used for requesting queue tokens
 */
export const tokenRequestSchema = z.object({
    patientName: z
        .string()
        .min(2, 'Patient name must be at least 2 characters long')
        .max(50, 'Patient name must not exceed 50 characters'),

    patientPhone: z
        .string()
        .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number (10-15 digits)'),

    department: z
        .string()
        .min(2, 'Please select a department'),

    symptoms: z
        .string()
        .min(10, 'Please describe symptoms (at least 10 characters)')
        .max(500, 'Symptoms description must not exceed 500 characters')
        .optional(),
});

export type TokenRequestFormData = z.infer<typeof tokenRequestSchema>;

/**
 * Login Form Schema
 * Used for user authentication
 */
export const loginSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase(),

    password: z
        .string()
        .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
