'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Users List Page (Protected)
 * - Requires authentication
 * - Displays list of users with links to dynamic routes
 */
export default function UsersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [router]);

    // Mock user data
    const users = [
        { id: '1', name: 'John Doe', role: 'PATIENT', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', role: 'DOCTOR', email: 'jane@example.com' },
        { id: '3', name: 'Admin User', role: 'ADMIN', email: 'admin@example.com' },
        { id: '4', name: 'Bob Johnson', role: 'PATIENT', email: 'bob@example.com' },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            👥 Users
                        </h1>
                        <Link
                            href="/dashboard"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            ← Dashboard
                        </Link>
                    </div>

                    <p className="text-gray-700 mb-6">
                        Click on any user to view their profile (dynamic route).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map((user) => (
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
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded text-sm text-gray-600">
                        <p className="font-semibold mb-1">Dynamic Routing:</p>
                        <p>Each user card links to <code className="bg-gray-200 px-1 rounded">/users/[id]</code> - a dynamic route!</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
