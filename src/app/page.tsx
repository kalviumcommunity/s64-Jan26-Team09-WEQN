import Link from 'next/link';

/**
 * Home Page (Public)
 * - No authentication required
 * - Welcome page with navigation to key routes
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          🏥 WEQN Hospital Queue Management
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Digital queue system for efficient patient care and doctor workflows
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg"
          >
            🔐 Login
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-lg"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/users"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors shadow-lg"
          >
            👥 Users
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md text-left">
          <h2 className="font-bold text-lg mb-3 text-gray-900">Route Map:</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ <strong>Public:</strong> / (Home), /login</li>
            <li>🔒 <strong>Protected:</strong> /dashboard, /users, /users/[id]</li>
            <li>🌐 <strong>Dynamic:</strong> /users/1, /users/2 (any user ID)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
