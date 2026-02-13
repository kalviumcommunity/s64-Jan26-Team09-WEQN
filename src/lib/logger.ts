/**
 * Structured Logging System for Cloud Environments (CloudWatch/Azure Monitor)
 * Implementation for Assignment 2.43
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
    message: string;
    level: LogLevel;
    timestamp: string;
    requestId?: string;
    route?: string;
    method?: string;
    statusCode?: number;
    error?: any;
    [key: string]: any;
}

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Formats and outputs the log to stdout/stderr
 */
function log(payload: LogPayload) {
    if (isProduction) {
        // Structured JSON for CloudWatch/Azure Monitor
        console.log(JSON.stringify(payload));
    } else {
        // Pretty logging for development
        const color = payload.level === 'error' ? '\x1b[31m' : 
                      payload.level === 'warn' ? '\x1b[33m' : 
                      payload.level === 'info' ? '\x1b[36m' : '\x1b[90m';
        const reset = '\x1b[0m';
        
        console.log(
            `${color}[${payload.level.toUpperCase()}]${reset} ${payload.timestamp} - ${payload.message}`,
            payload.error ? payload.error : '',
            Object.keys(payload).filter(k => !['message', 'level', 'timestamp', 'error'].includes(k)).length > 0 
                ? JSON.stringify(Object.fromEntries(Object.entries(payload).filter(([k]) => !['message', 'level', 'timestamp', 'error'].includes(k))))
                : ''
        );
    }
}

/**
 * Logger Utility
 */
export const logger = {
    info(message: string, context: Partial<LogPayload> = {}) {
        log({
            ...context,
            message,
            level: 'info',
            timestamp: new Date().toISOString(),
        });
    },

    warn(message: string, context: Partial<LogPayload> = {}) {
        log({
            ...context,
            message,
            level: 'warn',
            timestamp: new Date().toISOString(),
        });
    },

    error(message: string, error?: any, context: Partial<LogPayload> = {}) {
        log({
            ...context,
            message,
            level: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: isProduction ? undefined : error.stack // Hide stack in production JSON logs to keep them clean, unless specifically needed
            } : error,
        });
    },

    debug(message: string, context: Partial<LogPayload> = {}) {
        if (!isProduction) {
            log({
                ...context,
                message,
                level: 'debug',
                timestamp: new Date().toISOString(),
            });
        }
    }
};
