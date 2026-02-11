'use client';

import ErrorFallback from '@/components/common/ErrorFallback';

/**
 * Error Boundary for Users Page
 * 
 * Catches and handles errors that occur during user data fetching or rendering.
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
            title="Unable to Load Users"
            message="We encountered an issue loading the users list. This might be due to a network problem or server error."
        />
    );
}
