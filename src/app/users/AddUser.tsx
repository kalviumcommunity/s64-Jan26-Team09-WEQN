'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';

/**
 * AddUser Component - Demonstrates Optimistic UI with SWR
 * 
 * Assignment 2.29: Client-Side Data Fetching with SWR
 * 
 * This component showcases:
 * - Optimistic cache updates using mutate()
 * - Instant UI feedback before API response
 * - Automatic revalidation after server confirmation
 */
export default function AddUser() {
    const { data } = useSWR('/api/users', fetcher);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddUser = async () => {
        if (!name || !email) return;

        setIsSubmitting(true);

        try {
            // ✅ OPTIMISTIC UPDATE
            // Update cache immediately before API call
            // The 'false' parameter prevents revalidation until we manually trigger it
            const optimisticUser = {
                id: `temp_${Date.now()}`,
                name,
                email,
                role: 'PATIENT',
                phone: null,
                isActive: true,
                createdAt: new Date().toISOString(),
            };

            console.log('🚀 Optimistic Update: Adding user to cache immediately');
            mutate(
                '/api/users',
                {
                    ...data,
                    data: [...(data?.data || []), optimisticUser],
                },
                false
            );

            // 🌐 ACTUAL API CALL
            console.log('📡 Sending POST request to /api/users');
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password: 'password123', // Demo password
                    role: 'PATIENT',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            // ✅ REVALIDATE
            // Fetch fresh data from server to sync cache with reality
            console.log('🔄 Revalidating /api/users to sync with server');
            await mutate('/api/users');

            // Clear form
            setName('');
            setEmail('');
            console.log('✅ User added successfully!');
        } catch (error) {
            console.error('❌ Error adding user:', error);
            // Revalidate to revert optimistic update
            mutate('/api/users');
            alert('Failed to add user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ➕ Add New User (Optimistic UI Demo)
            </h3>

            <div className="space-y-3">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    onClick={handleAddUser}
                    disabled={!name || !email || isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '⏳ Adding...' : '✅ Add User'}
                </button>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-green-300 text-sm text-gray-700">
                <p className="font-semibold mb-1">💡 How Optimistic UI Works:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>UI updates instantly (user appears in list)</li>
                    <li>API request sent in background</li>
                    <li>Cache revalidates with server response</li>
                    <li>User sees smooth, responsive experience</li>
                </ol>
            </div>
        </div>
    );
}
