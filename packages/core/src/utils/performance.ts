/**
 * Performance Utilities
 * Memoization and caching for frequently accessed data
 */

/**
 * Simple memoization function for single-argument functions
 * @param fn - Function to memoize
 * @returns Memoized function
 */
export function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
    const cache = new Map<A, R>();

    return (arg: A): R => {
        if (cache.has(arg)) {
            return cache.get(arg)!;
        }

        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}

/**
 * Memoization with time-to-live (TTL)
 * Cache entries expire after specified duration
 * @param fn - Function to memoize
 * @param ttlMs - Time-to-live in milliseconds
 * @returns Memoized function with TTL
 */
export function memoizeWithTTL<A, R>(
    fn: (arg: A) => R,
    ttlMs: number
): (arg: A) => R {
    const cache = new Map<A, { value: R; expiry: number }>();

    return (arg: A): R => {
        const now = Date.now();

        const cached = cache.get(arg);
        if (cached && cached.expiry > now) {
            return cached.value;
        }

        const result = fn(arg);
        cache.set(arg, { value: result, expiry: now + ttlMs });
        return result;
    };
}

/**
 * Lazy initialization wrapper
 * Value is only computed on first access
 */
export function lazy<T>(factory: () => T): { value: T } {
    let cached: T | undefined;
    let initialized = false;

    return {
        get value(): T {
            if (!initialized) {
                cached = factory();
                initialized = true;
            }
            return cached!;
        }
    };
}

/**
 * Create a singleton instance
 * Ensures only one instance is created
 */
export function singleton<T>(factory: () => T): () => T {
    let instance: T | undefined;

    return () => {
        if (instance === undefined) {
            instance = factory();
        }
        return instance;
    };
}
