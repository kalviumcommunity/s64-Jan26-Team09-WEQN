'use client';

import { useState } from 'react';

interface ErrorFallbackProps {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
    message?: string;
    className?: string;
}

/**
 * ErrorFallback Component
 * 
 * Reusable error boundary UI with retry functionality.
 * Displays user-friendly error messages and allows recovery.
 * 
 * @param error - Error object from error boundary
 * @param reset - Function to retry/reset the error boundary
 * @param title - Custom error title (optional)
 * @param message - Custom error message (optional)
 * @param className - Additional CSS classes
 */
export default function ErrorFallback({
    error,
    reset,
    title = 'Oops! Something went wrong',
    message,
    className = ''
}: ErrorFallbackProps) {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            reset();
        } catch (err) {
            console.error('Retry failed:', err);
        } finally {
            // Reset after a short delay to show visual feedback
            setTimeout(() => setIsRetrying(false), 500);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}>
            {/* Error Icon */}
            <div className="mb-6">
                <svg
                    className="w-16 h-16 text-red-500 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md">
                {message || error.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && error.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 font-mono">
                    Error ID: {error.digest}
                </p>
            )}

            {/* Retry Button */}
            <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="mt-4 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
            >
                {isRetrying ? (
                    <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Retrying...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                    </>
                )}
            </button>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                If the problem persists, please contact support.
            </p>
        </div>
    );
}
