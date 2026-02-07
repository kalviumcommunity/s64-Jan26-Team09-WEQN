'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Dynamic User Profile Page (Protected)
 * - Requires authentication
 * - Displays user details based on dynamic [id] parameter
 * - Demonstrates breadcrumbs navigation
 */

interface Props {
    params: { id: string };
}

export default function UserProfilePage({ params }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = params;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [router]);

    // Mock user data (in real app, fetch from API using id)
    const userDatabase: Record<string, any> = {
        '1': { id: '1', name: 'John Doe', role: 'PATIENT', email: 'john@example.com', phone: '+1234567890', joinedDate: '2024-01-15' },
        '2': { id: '2', name: 'Jane Smith', role: 'DOCTOR', email: 'jane@example.com', phone: '+1234567891', joinedDate: '2023-05-10' },
        '3': { id: '3', name: 'Admin User', role: 'ADMIN', email: 'admin@example.com', phone: '+1234567892', joinedDate: '2023-01-01' },
        '4': { id: '4', name: 'Bob Johnson', role: 'PATIENT', email: 'bob@example.com', phone: '+1234567893', joinedDate: '2024-02-20' },
    };

    const user = userDatabase[id] || { id, name: `User ${id}`, role: 'UNKNOWN', email: 'N/A' };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="mb-4 text-sm text-gray-600">
                    <Link href="/" className="hover:underline">Home</Link>
                    {' > '}
                    <Link href="/users" className="hover:underline">Users</Link>
                    {' > '}
                    <span className="text-gray-900 font-semibold">User #{id}</span>
                </nav>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            👤 User Profile
                        </h1>
                        <Link
                            href="/users"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            ← All Users
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                                👤
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Details:</h3>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>User ID:</strong> {user.id}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                                <p><strong>Joined:</strong> {user.joinedDate || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded">
                            <h3 className="font-semibold text-blue-900 mb-2">Dynamic Route Info:</h3>
                            <p className="text-sm text-blue-700">
                                This page is rendered from <code className="bg-blue-100 px-1 rounded">/users/[id]/page.tsx</code>
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Current dynamic parameter: <code className="bg-blue-100 px-1 rounded">id = "{id}"</code>
                            </p>
                        </div>

                        <div className="flex gap-3 mt-6">
                            {['1', '2', '3', '4'].map((userId) => (
                                <Link
                                    key={userId}
                                    href={`/users/${userId}`}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${userId === id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                        }`}
                                >
                                    User {userId}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
