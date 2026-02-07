/**
 * Structured Logger Utility
 * 
 * Provides consistent, JSON-formatted logging for production observability.
 * Supports different log levels (info, warn, error) with timestamps and metadata.
 */

/**
 * Log level type
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Log metadata interface
 */
interface LogMetadata {
    [key: string]: any;
}

/**
 * Structured log entry
 */
interface LogEntry {
    level: LogLevel;
    message: string;
    meta?: LogMetadata;
    timestamp: string;
    environment: string;
}

/**
 * Create structured log entry
 */
function createLogEntry(
    level: LogLevel,
    message: string,
    meta?: LogMetadata
): LogEntry {
    return {
        level,
        message,
        meta,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    };
}

/**
 * Logger utility with structured output
 */
export const logger = {
    /**
     * Log informational message
     */
    info: (message: string, meta?: LogMetadata) => {
        const entry = createLogEntry('info', message, meta);
        console.log(JSON.stringify(entry));
    },

    /**
     * Log warning message
     */
    warn: (message: string, meta?: LogMetadata) => {
        const entry = createLogEntry('warn', message, meta);
        console.warn(JSON.stringify(entry));
    },

    /**
     * Log error message
     */
    error: (message: string, meta?: LogMetadata) => {
        const entry = createLogEntry('error', message, meta);
        console.error(JSON.stringify(entry));
    },

    /**
     * Log debug message (only in development)
     */
    debug: (message: string, meta?: LogMetadata) => {
        if (process.env.NODE_ENV !== 'production') {
            const entry = createLogEntry('debug', message, meta);
            console.debug(JSON.stringify(entry));
        }
    },
};

/**
 * Example usage:
 * 
 * logger.info('User logged in', { userId: '123', email: 'user@example.com' });
 * logger.error('Database connection failed', { error: err.message, stack: err.stack });
 * logger.warn('Rate limit approaching', { currentRequests: 95, limit: 100 });
 */
