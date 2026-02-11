'use client';

import ErrorFallback from '@/components/common/ErrorFallback';

/**
 * Error Boundary for Dashboard Page
 * 
 * Catches and handles errors that occur during dashboard data fetching or rendering.
 * Provides retry functionality to recover from errors.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorFallback
            error={error}
            reset={reset}
            title="Dashboard Unavailable"
            message="We're having trouble loading your dashboard. Please check your connection and try again."
        />
    );
}
