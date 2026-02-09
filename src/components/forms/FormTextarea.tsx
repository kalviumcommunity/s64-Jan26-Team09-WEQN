import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

/**
 * Reusable Form Textarea Component
 * Assignment 2.30: Form Handling & Validation
 * 
 * Generic textarea component for multi-line text input:
 * - Connected labels via htmlFor
 * - ARIA attributes for accessibility
 * - Character count display
 * - Error message display
 * - Consistent styling
 */

interface FormTextareaProps {
    label: string;
    name: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    register: UseFormRegister<any>;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    showCharCount?: boolean;
    className?: string;
}

export default function FormTextarea({
    label,
    name,
    placeholder,
    rows = 4,
    maxLength,
    register,
    error,
    required = false,
    disabled = false,
    showCharCount = false,
    className = '',
}: FormTextareaProps) {
    const [charCount, setCharCount] = React.useState(0);

    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <textarea
                id={name}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`
          w-full px-3 py-2 border rounded-lg resize-y
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...register(name)}
                onChange={(e) => {
                    register(name).onChange(e);
                    if (showCharCount) {
                        setCharCount(e.target.value.length);
                    }
                }}
            />

            {showCharCount && maxLength && (
                <p className="mt-1 text-xs text-gray-500 text-right">
                    {charCount} / {maxLength} characters
                </p>
            )}

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
