import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

/**
 * Reusable Form Input Component
 * Assignment 2.30: Form Handling & Validation
 * 
 * Generic input component with full accessibility support:
 * - Connected labels via htmlFor
 * - ARIA attributes for screen readers
 * - Error message display
 * - Consistent styling
 */

interface FormInputProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
    placeholder?: string;
    register: UseFormRegister<any>;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function FormInput({
    label,
    name,
    type = 'text',
    placeholder,
    register,
    error,
    required = false,
    disabled = false,
    className = '',
}: FormInputProps) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...register(name)}
            />

            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}
