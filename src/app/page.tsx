import Link from 'next/link';

/**
 * Home Page (Public)
 * - No authentication required
 * - Welcome page with navigation to key routes
 * - Fully responsive with dark mode support
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-bg-primary dark:to-dark-bg-secondary transition-colors duration-300">
      <div className="text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl px-4">
        {/* Header - Responsive text sizes */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-900 dark:text-dark-text-primary transition-colors">
          🏥 WEQN Hospital Queue Management
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-dark-text-secondary mb-6 sm:mb-8 transition-colors">
          Digital queue system for efficient patient care and doctor workflows
        </p>

        {/* Action Buttons - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
          <Link
            href="/login"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-brand text-white rounded-lg hover:bg-brand-dark font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 dark:bg-brand-light dark:hover:bg-brand"
          >
            🔐 Login
          </Link>

          <Link
            href="/dashboard"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-medical-success text-white rounded-lg hover:bg-green-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/users"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-medical-info text-white rounded-lg hover:bg-purple-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 sm:col-span-2 lg:col-span-1"
          >
            👥 Users
          </Link>
        </div>

        {/* Info Card - Responsive padding and text */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 text-left border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-dark-text-primary">
            Route Map:
          </h2>

          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-700 dark:text-dark-text-secondary">
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span><strong className="text-gray-900 dark:text-dark-text-primary">Public:</strong> / (Home), /login</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔒</span>
              <span><strong className="text-gray-900 dark:text-dark-text-primary">Protected:</strong> /dashboard, /users, /users/[id]</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌐</span>
              <span><strong className="text-gray-900 dark:text-dark-text-primary">Dynamic:</strong> /users/1, /users/2 (any user ID)</span>
            </li>
          </ul>
        </div>

        {/* Responsive Design Notice */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-brand/10 dark:bg-brand-dark/20 rounded-lg border border-brand/20 dark:border-brand-light/20">
          <p className="text-xs sm:text-sm text-brand-dark dark:text-brand-light font-medium">
            💡 Try toggling dark mode and resizing your browser to see responsive design in action!
          </p>
        </div>
      </div>
    </main>
  );
}
