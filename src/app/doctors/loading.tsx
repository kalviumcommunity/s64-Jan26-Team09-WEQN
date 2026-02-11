/**
 * Loading State for Doctors Page
 * 
 * Displays skeleton UI while doctors data is being fetched.
 * Shows table-style skeleton matching expected doctor list layout.
 */
export default function Loading() {
    return (
        <div className="container mx-auto p-6">
            {/* Page Header Skeleton */}
            <div className="mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>

            {/* Doctors Table Skeleton */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 gap-4 animate-pulse">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
                    </div>
                </div>

                {/* Table Rows */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                        <div className="grid grid-cols-4 gap-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 self-center" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 self-center" />
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 self-center" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
