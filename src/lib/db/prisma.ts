import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';

/**
 * Prisma Client Singleton
 * Assignment 2.38: Cloud Database Configuration
 * Assignment 2.43: Structured Logging Integration
 * Prevents multiple instances in development due to hot reloading
 * which can exhaust database connection limits.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isProd = process.env.NODE_ENV === 'production';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Emit log events so we can pipe them to our structured logger
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
      ...(isProd ? [] : [{ emit: 'event' as const, level: 'query' as const }]),
    ],
  });

// Pipe Prisma logs to our structured logger
(prisma as any).$on('error', (e: any) => {
  logger.error('Prisma Error', e);
});

(prisma as any).$on('warn', (e: any) => {
  logger.warn('Prisma Warning', e);
});

if (!isProd) {
  (prisma as any).$on('query', (e: any) => {
    // Queries are only logged in development to avoid sensitive data exposure in production
    logger.debug(`Prisma Query: ${e.query}`, { duration: e.duration, params: e.params });
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma on process termination
 * Essential for cloud-managed databases to free up connections
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
