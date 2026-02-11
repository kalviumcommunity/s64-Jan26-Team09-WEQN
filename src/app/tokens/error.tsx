'use client';

import ErrorFallback from '@/components/common/ErrorFallback';

/**
 * Error Boundary for Tokens/Queue Page
 * 
 * Catches and handles errors that occur during token queue data fetching or rendering.
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
            title="Queue Information Unavailable"
            message="We're unable to load the queue information at this time. Please wait a moment and try again."
        />
    );
}
