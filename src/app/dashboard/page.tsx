'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Dashboard Page (Protected)
 * - Requires authentication
 * - Shows user info from localStorage
 * - Provides logout functionality
 */
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            // No token, redirect to login
            router.push('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        setLoading(false);
    }, [router]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Dashboard
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {user && (
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-3 text-gray-900">
                                Welcome, {user.name}!
                            </h2>
                            <div className="space-y-1 text-sm text-gray-700">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <h3 className="font-semibold text-green-900">Protected Route</h3>
                            <p className="text-sm text-green-700">
                                This page requires authentication ✅
                            </p>
                        </div>
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                            <h3 className="font-semibold text-purple-900">Token Verified</h3>
                            <p className="text-sm text-purple-700">
                                JWT token validated successfully ✅
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-gray-900">Quick Links:</h2>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/users"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                👥 View Users
                            </Link>
                            <Link
                                href="/users/1"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                👤 User Profile #1
                            </Link>
                            <Link
                                href="/"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                🏠 Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
