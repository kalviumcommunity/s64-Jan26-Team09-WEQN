import { createClient, RedisClientType } from 'redis';

/**
 * Redis Client Singleton
 * Prevents multiple instances in development due to hot reloading
 * 
 * Assignment 2.23: Caching Layer with Redis
 * 
 * Usage:
 *   import { redis } from '@/lib/db/redis';
 *   await redis.get('cache_key');
 */

const globalForRedis = global as unknown as { redis: RedisClientType };

export const redis: RedisClientType =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

// Auto-connect to Redis in development
if (process.env.NODE_ENV !== 'production' && !redis.isOpen) {
  redis.connect().catch((err) => {
    console.error('❌ Redis connection failed:', err.message);
    console.log('⚠️  Redis is required for caching. Make sure Redis is running.');
    console.log('📝 Start Redis with: docker-compose up redis');
  });
}

// Handle connection events
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

/**
 * Gracefully disconnect Redis on process termination
 */
process.on('beforeExit', async () => {
  if (redis.isOpen) {
    try {
      await redis.disconnect();
      console.log('✅ Redis disconnected');
    } catch (err) {
      console.error('Error disconnecting Redis:', err);
    }
  }
});

// Store singleton for dev hot-reloading
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export default redis;
