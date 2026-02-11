/**
 * Centralized Fetcher Utility for SWR
 * 
 * This fetcher is used by all SWR hooks across the application
 * to ensure consistent error handling and response parsing.
 * 
 * Assignment 2.29: Client-Side Data Fetching with SWR
 */

/**
 * Generic fetch wrapper for SWR
 * @param url - API endpoint URL
 * @returns Parsed JSON response
 * @throws Error if response is not OK or JSON parsing fails
 */
export const fetcher = async (url: string) => {
    const res = await fetch(url);

    // Handle HTTP errors
    if (!res.ok) {
        const error = new Error('Failed to fetch data');
        // Attach extra info to the error object
        (error as any).status = res.status;
        (error as any).info = await res.json().catch(() => ({}));
        throw error;
    }

    return res.json();
};

/**
 * Type-safe fetcher with generic return type
 * @param url - API endpoint URL
 * @returns Typed JSON response
 */
export const typedFetcher = async <T>(url: string): Promise<T> => {
    return fetcher(url);
};
