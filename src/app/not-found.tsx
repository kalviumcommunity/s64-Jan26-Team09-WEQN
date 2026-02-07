import Link from 'next/link';

/**
 * Custom 404 Page
 * - Displayed when user navigates to non-existent route
 * - Provides navigation back to home
 */
export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-bold text-red-600 mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Oops! The page you're looking for doesn't exist.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                    >
                        🏠 Go to Home
                    </Link>
                    <Link
                        href="/login"
                        className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                    >
                        🔐 Login
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-600">
                    <p>Lost? Try these routes:</p>
                    <ul className="mt-2 space-y-1">
                        <li>/ - Home page</li>
                        <li>/login - Login page</li>
                        <li>/dashboard - Dashboard (requires auth)</li>
                        <li>/users - Users list (requires auth)</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
