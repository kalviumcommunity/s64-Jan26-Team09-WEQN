import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Assignment 2.38: Cloud Database Configuration
 * Prevents multiple instances in development due to hot reloading
 * which can exhaust database connection limits.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Enable verbose logging in development, restrict to errors in production
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Cloud DB Tip: If using a connection pooler like PgBouncer, 
    // ensure your DATABASE_URL reflects the pooler's port.
  });

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
