/**
 * Input Sanitization Utility
 * 
 * Provides functions to clean and normalize user input to prevent XSS and other injection attacks.
 */

/**
 * Escapes dangerous HTML characters to prevent XSS
 */
export function escapeHTML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Removes <script> tags and their content
 */
export function removeScripts(str: string): string {
    return str.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}

/**
 * Sanitizes a single string value
 */
export function sanitizeString(value: string): string {
    if (typeof value !== 'string') return value;
    
    let sanitized = value.trim();
    sanitized = removeScripts(sanitized);
    sanitized = escapeHTML(sanitized);
    
    return sanitized;
}

/**
 * Recursively sanitizes an object, array, or primitive value
 */
export function sanitize<T>(input: T): T {
    // Handle null or undefined
    if (input === null || input === undefined) {
        return input;
    }

    // Handle strings
    if (typeof input === 'string') {
        return sanitizeString(input) as unknown as T;
    }

    // Handle arrays
    if (Array.isArray(input)) {
        return input.map(item => sanitize(item)) as unknown as T;
    }

    // Handle objects
    if (typeof input === 'object') {
        const sanitizedObj: any = {};
        for (const [key, value] of Object.entries(input)) {
            sanitizedObj[key] = sanitize(value);
        }
        return sanitizedObj as T;
    }

    // Return other types (numbers, booleans) as is
    return input;
}
