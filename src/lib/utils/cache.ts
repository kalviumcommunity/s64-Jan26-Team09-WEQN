import { redis } from '@/lib/db/redis';

/**
 * Cache Utility Module
 * Provides helpers for getting, setting, and invalidating Redis cache
 * 
 * Assignment 2.23: Caching Layer with Redis
 */

/**
 * Get cached value
 * @param key - Cache key
 * @returns Parsed JSON value or null if not found
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error(`Cache GET error for key "${key}":`, error);
    return null;
  }
}

/**
 * Set cached value with TTL
 * @param key - Cache key
 * @param value - Value to cache (will be JSON stringified)
 * @param ttl - Time to live in seconds (default: 60)
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = 60
): Promise<void> {
  try {
    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Cache SET error for key "${key}":`, error);
  }
}

/**
 * Delete a specific cache key
 * @param key - Cache key to delete
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache DELETE error for key "${key}":`, error);
  }
}

/**
 * Invalidate cache by pattern
 * Useful for invalidating all related cache entries (e.g., all doctor lists)
 * @param pattern - Pattern to match (e.g., "doctors:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`✅ Invalidated ${keys.length} cache entries matching "${pattern}"`);
    }
  } catch (error) {
    console.error(`Cache INVALIDATE error for pattern "${pattern}":`, error);
  }
}

/**
 * Generate a cache key from request parameters
 * Useful for caching GET requests with query params
 * @param prefix - Cache prefix (e.g., "doctors")
 * @param params - Query parameters object
 * @returns Cache key string
 */
export function generateCacheKey(
  prefix: string,
  params?: Record<string, string | number | null | undefined>
): string {
  if (!params || Object.keys(params).length === 0) {
    return prefix;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .filter((key) => params[key] !== null && params[key] !== undefined)
    .map((key) => `${key}:${params[key]}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}
