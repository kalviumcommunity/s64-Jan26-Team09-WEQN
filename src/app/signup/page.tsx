'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/schemas/formSchemas';
import FormInput from '@/components/forms/FormInput';
import Link from 'next/link';

/**
 * Signup Page Component
 * Assignment 2.30: Form Handling & Validation
 * 
 * Demonstrates:
 * - React Hook Form integration
 * - Zod schema validation via zodResolver
 * - Reusable FormInput components
 * - Accessibility features (labels, ARIA, keyboard nav)
 * - Form submission handling
 * - Loading and success states
 */
export default function SignupPage() {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('✅ Form Submitted:', data);
        console.log('📋 Validated Data:', {
            name: data.name,
            email: data.email,
            passwordLength: data.password.length,
        });

        setIsSuccess(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSuccess(false);
            reset();
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📝 Create Account
                        </h1>
                        <p className="text-gray-600">
                            Fill out the form below to create your account
                        </p>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">✅</span>
                                <div>
                                    <p className="font-semibold text-green-900">Account created successfully!</p>
                                    <p className="text-sm text-green-700">Welcome to our platform.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormInput
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            register={register}
                            error={errors.name}
                            required
                        />

                        <FormInput
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            register={register}
                            error={errors.email}
                            required
                        />

                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter a strong password"
                            register={register}
                            error={errors.password}
                            required
                        />

                        <FormInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            register={register}
                            error={errors.confirmPassword}
                            required
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isSuccess}
                            className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                transition-colors duration-200
                ${isSubmitting || isSuccess
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                                }
              `}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : isSuccess ? (
                                'Account Created ✓'
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Log in
                            </Link>
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                            🔐 Password Requirements:
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• At least 6 characters long</li>
                            <li>• Contains uppercase and lowercase letters</li>
                            <li>• Contains at least one number</li>
                        </ul>
                    </div>
                </div>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-white rounded-lg shadow text-sm text-gray-600">
                    <p className="font-semibold text-gray-900 mb-2">
                        💡 Form Validation Features:
                    </p>
                    <ul className="space-y-1">
                        <li>✅ Real-time validation with React Hook Form</li>
                        <li>✅ Schema-based validation with Zod</li>
                        <li>✅ Accessibility support (ARIA labels)</li>
                        <li>✅ Reusable form components</li>
                        <li>✅ Type-safe with TypeScript</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
