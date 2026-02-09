'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/schemas/formSchemas';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import Link from 'next/link';

/**
 * Contact Page Component
 * Assignment 2.30: Form Handling & Validation
 * 
 * Demonstrates:
 * - React Hook Form with Zod validation
 * - FormInput and FormTextarea reusable components
 * - Character count for textarea
 * - Form reset after submission
 * - Success/error feedback
 */
export default function ContactPage() {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200));

        console.log('📧 Contact Form Submitted:', data);
        console.log('📋 Message Details:', {
            from: data.name,
            email: data.email,
            subject: data.subject || 'No subject provided',
            messageLength: data.message.length,
        });

        setIsSuccess(true);

        // Reset form and success message after 3 seconds
        setTimeout(() => {
            setIsSuccess(false);
            reset();
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ✉️ Contact Us
                        </h1>
                        <p className="text-gray-600">
                            Have a question or feedback? We'd love to hear from you!
                        </p>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">✅</span>
                                <div>
                                    <p className="font-semibold text-green-900">Message sent successfully!</p>
                                    <p className="text-sm text-green-700">We'll get back to you as soon as possible.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Your Name"
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
                        </div>

                        <FormInput
                            label="Subject"
                            name="subject"
                            type="text"
                            placeholder="What is this about?"
                            register={register}
                            error={errors.subject}
                        />

                        <FormTextarea
                            label="Message"
                            name="message"
                            placeholder="Please describe your inquiry in detail..."
                            rows={6}
                            maxLength={1000}
                            showCharCount
                            register={register}
                            error={errors.message}
                            required
                        />

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={`
                  flex-1 py-3 px-6 rounded-lg font-semibold text-white
                  transition-colors duration-200
                  ${isSubmitting || isSuccess
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
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
                                        Sending Message...
                                    </span>
                                ) : isSuccess ? (
                                    'Message Sent ✓'
                                ) : (
                                    'Send Message'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => reset()}
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need immediate assistance?{' '}
                            <Link href="/dashboard" className="text-green-600 hover:text-green-700 font-semibold">
                                Visit Dashboard
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Validation Info */}
                    <div className="p-4 bg-white rounded-lg shadow">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                            ✨ Form Features:
                        </p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Real-time validation feedback</li>
                            <li>• Character count for message</li>
                            <li>• Accessible form controls</li>
                            <li>• Reset functionality</li>
                        </ul>
                    </div>

                    {/* Validation Rules */}
                    <div className="p-4 bg-white rounded-lg shadow">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                            📏 Validation Rules:
                        </p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Name: minimum 2 characters</li>
                            <li>• Email: valid format required</li>
                            <li>• Message: 10-1000 characters</li>
                            <li>• Subject: optional field</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
