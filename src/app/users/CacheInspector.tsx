'use client';

import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';

/**
 * CacheInspector Component - Visualizes SWR Cache State
 * 
 * Assignment 2.29: Client-Side Data Fetching with SWR
 * 
 * This component demonstrates:
 * - Accessing SWR's internal cache
 * - Displaying active cache keys
 * - Showing cache hits/misses in real-time
 * - Understanding stale-while-revalidate behavior
 */
export default function CacheInspector() {
    const { cache } = useSWRConfig();
    const [cacheKeys, setCacheKeys] = useState<string[]>([]);
    const [cacheStats, setCacheStats] = useState({
        hits: 0,
        misses: 0,
        lastUpdate: new Date().toLocaleTimeString(),
    });

    useEffect(() => {
        // Update cache keys every 2 seconds
        const interval = setInterval(() => {
            if (cache instanceof Map) {
                const keys = Array.from(cache.keys()).filter((key) => typeof key === 'string') as string[];
                setCacheKeys(keys);
                setCacheStats((prev) => ({
                    ...prev,
                    lastUpdate: new Date().toLocaleTimeString(),
                }));
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [cache]);

    // Simulate cache hit/miss tracking from console logs
    useEffect(() => {
        const originalLog = console.log;
        console.log = (...args) => {
            const message = args.join(' ');
            if (message.includes('Cache HIT')) {
                setCacheStats((prev) => ({ ...prev, hits: prev.hits + 1 }));
            } else if (message.includes('Cache MISS')) {
                setCacheStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
            }
            originalLog.apply(console, args);
        };

        return () => {
            console.log = originalLog;
        };
    }, []);

    return (
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 SWR Cache Inspector
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="text-2xl font-bold text-purple-600">{cacheKeys.length}</div>
                    <div className="text-sm text-gray-600">Active Cache Keys</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="text-2xl font-bold text-green-600">{cacheStats.hits}</div>
                    <div className="text-sm text-gray-600">Cache Hits</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-300">
                    <div className="text-2xl font-bold text-red-600">{cacheStats.misses}</div>
                    <div className="text-sm text-gray-600">Cache Misses</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-300">
                <p className="font-semibold text-gray-900 mb-2">📋 Cached Keys:</p>
                {cacheKeys.length > 0 ? (
                    <ul className="space-y-1">
                        {cacheKeys.map((key, index) => (
                            <li key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                {key}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No active cache keys</p>
                )}
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-purple-300 text-sm text-gray-700">
                <p className="font-semibold mb-1">💡 Understanding Cache Behavior:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Cache Hit:</strong> Data served from cache instantly</li>
                    <li><strong>Cache Miss:</strong> Fresh fetch from API</li>
                    <li><strong>Stale-While-Revalidate:</strong> Show stale data, fetch fresh in background</li>
                    <li>Last update: <span className="font-mono">{cacheStats.lastUpdate}</span></li>
                </ul>
            </div>
        </div>
    );
}
