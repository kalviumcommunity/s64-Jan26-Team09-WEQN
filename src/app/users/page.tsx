'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import AddUser from './AddUser';
import CacheInspector from './CacheInspector';

/**
 * Users List Page with SWR (Protected)
 * 
 * Assignment 2.29: Client-Side Data Fetching with SWR
 * 
 * This page demonstrates:
 * - Client-side data fetching with SWR
 * - Automatic caching and revalidation
 * - Stale-while-revalidate pattern
 * - Revalidation on focus
 * - Error handling
 * - Loading states
 */
export default function UsersPage() {
    const router = useRouter();
    const [authLoading, setAuthLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setAuthLoading(false);
    }, [router]);

    // ✅ SWR Hook with Configuration
    const {
        data,
        error,
        isLoading,
        mutate: revalidate,
    } = useSWR('/api/users', fetcher, {
        // Revalidate when window regains focus
        revalidateOnFocus: true,

        // Revalidate every 30 seconds
        refreshInterval: 30000,

        // Retry on error with exponential backoff
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404
            if (error.status === 404) return;

            // Only retry up to 3 times
            if (retryCount >= 3) return;

            // Retry after 2 seconds
            setTimeout(() => revalidate({ retryCount }), 2000);
        },

        // Log cache behavior
        onSuccess: (data, key) => {
            console.log(`✅ Cache HIT or Fresh Fetch: ${key}`, data);
        },

        onError: (err, key) => {
            console.error(`❌ Error fetching ${key}:`, err);
        },
    });

    // Show loading during auth check
    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">🔐 Checking authentication...</div>
            </div>
        );
    }

    // Show SWR loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">⏳ Loading users...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">❌ Error Loading Users</div>
                    <p className="text-red-600 mb-4">{error.message || 'Failed to load users'}</p>
                    <button
                        onClick={() => revalidate()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    // Extract users from API response
    const users = data?.data || [];

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                👥 Users (SWR Demo)
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Using SWR for client-side data fetching
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => revalidate()}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                🔄 Refresh
                            </button>
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                ← Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* SWR Info Banner */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-semibold text-blue-900 mb-2">
                            🚀 SWR Features Active:
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>✅ <strong>Stale-While-Revalidate:</strong> Shows cached data instantly, fetches fresh data in background</li>
                            <li>✅ <strong>Revalidate on Focus:</strong> Auto-refreshes when you return to this tab</li>
                            <li>✅ <strong>Auto Refresh:</strong> Revalidates every 30 seconds</li>
                            <li>✅ <strong>Error Retry:</strong> Automatically retries up to 3 times on failure</li>
                        </ul>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {users.length > 0 ? (
                            users.map((user: any) => (
                                <Link
                                    key={user.id}
                                    href={`/users/${user.id}`}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                            👤
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                                No users found
                            </div>
                        )}
                    </div>

                    {/* Add User Component */}
                    <AddUser />

                    {/* Cache Inspector */}
                    <CacheInspector />
                </div>
            </div>
        </main>
    );
}
