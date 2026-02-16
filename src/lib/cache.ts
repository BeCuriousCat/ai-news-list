import { CacheEntry, TrendingParams } from "./types";

// In-memory cache store
const cache = new Map<string, CacheEntry<unknown>>();

// Default TTL values (in milliseconds)
const DEFAULT_TTL = {
  daily: 30 * 60 * 1000, // 30 minutes
  weekly: 2 * 60 * 60 * 1000, // 2 hours
  monthly: 6 * 60 * 60 * 1000, // 6 hours
};

// Generate cache key from params
export function getCacheKey(params: TrendingParams): string {
  return `trending:${params.since}:${params.language || "all"}`;
}

// Get from cache
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    return null;
  }

  // Check if expired
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

// Set cache with TTL
export function setCache<T>(key: string, data: T, ttlMs?: number): void {
  const ttl = ttlMs || DEFAULT_TTL.daily;
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

// Get TTL for time range
export function getTTL(since: "daily" | "weekly" | "monthly"): number {
  return DEFAULT_TTL[since] || DEFAULT_TTL.daily;
}

// Clear all cache
export function clearCache(): void {
  cache.clear();
}

// Clear expired entries
export function clearExpiredCache(): void {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  for (const [key, entry] of entries) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
    }
  }
}

// Get cache stats
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
