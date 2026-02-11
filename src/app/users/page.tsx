import Link from 'next/link';

/**
 * Users List Page
 * - Server Component with async data fetching
 * - Demonstrates loading.tsx and error.tsx in action
 * - Supports query params for testing: ?delay=2000&simulateError=true
 */

// Simulated async data fetch
async function getUsers(searchParams: { delay?: string; simulateError?: string }) {
    // Simulate delay if specified
    const delay = Number(searchParams.delay) || 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate error if specified
    if (searchParams.simulateError === 'true') {
        throw new Error('Failed to load user data from server');
    }

    // Mock user data
    return [
        { id: '1', name: 'John Doe', role: 'PATIENT', email: 'john@example.com' },
        { id: '2', name: 'Dr. Jane Smith', role: 'DOCTOR', email: 'jane@hospital.com' },
        { id: '3', name: 'Admin User', role: 'ADMIN', email: 'admin@hospital.com' },
        { id: '4', name: 'Bob Johnson', role: 'PATIENT', email: 'bob@example.com' },
        { id: '5', name: 'Dr. Sarah Lee', role: 'DOCTOR', email: 'sarah@hospital.com' },
        { id: '6', name: 'Mike Wilson', role: 'PATIENT', email: 'mike@example.com' },
    ];
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { delay?: string; simulateError?: string };
}) {
    // Fetch users with simulated delay/error
    const users = await getUsers(searchParams);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-bg-primary dark:to-dark-bg-secondary p-8 transition-colors">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            👥 Users
                        </h1>
                        <Link
                            href="/dashboard"
                            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            ← Dashboard
                        </Link>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Click on any user to view their profile (dynamic route).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/users/${user.id}`}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 dark:hover:border-brand-light transition-all bg-white dark:bg-dark-bg-tertiary"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-brand/20 rounded-full flex items-center justify-center text-2xl">
                                        👤
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                        <span className="inline-block mt-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded font-medium">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold mb-2">Testing Error & Loading States:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Add <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">?delay=3000</code> to see loading skeleton</li>
                            <li>Add <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">?simulateError=true</code> to trigger error boundary</li>
                        </ul>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold mb-1">Dynamic Routing:</p>
                        <p>Each user card links to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/users/[id]</code> - a dynamic route!</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
