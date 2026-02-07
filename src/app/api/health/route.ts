import { NextRequest } from 'next/server';
import { handleError, createNotFoundError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { sendSuccess } from '@/lib/responseHandler';

/**
 * GET /api/health
 * Health check endpoint - demonstrates error handling in different scenarios
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simulate = searchParams.get('simulate');

    // Log health check
    logger.info('Health check requested', { simulate });

    // Simulate different error scenarios for testing
    if (simulate === 'error') {
      throw new Error('Simulated error for testing error handler');
    }

    if (simulate === 'notfound') {
      throw createNotFoundError('Resource');
    }

    // Return healthy status
    return sendSuccess(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
      'Service is running'
    );
  } catch (error) {
    return handleError(error, 'GET /api/health');
  }
}
