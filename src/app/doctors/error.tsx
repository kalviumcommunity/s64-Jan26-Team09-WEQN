'use client';

import ErrorFallback from '@/components/common/ErrorFallback';

/**
 * Error Boundary for Doctors Page
 * 
 * Catches and handles errors that occur during doctors data fetching or rendering.
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
            title="Unable to Load Doctors"
            message="We're experiencing issues loading the doctors list. Please try again in a moment."
        />
    );
}
