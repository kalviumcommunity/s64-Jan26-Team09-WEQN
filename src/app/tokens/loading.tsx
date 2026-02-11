/**
 * Loading State for Tokens/Queue Page
 * 
 * Displays skeleton UI while token queue data is being fetched.
 * Shows list-based skeleton matching expected queue display.
 */
export default function Loading() {
    return (
        <div className="container mx-auto p-6">
            {/* Page Header Skeleton */}
            <div className="mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>

            {/* Queue Status Bar Skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-white dark:bg-dark-bg-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Token List Skeleton */}
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                <div className="space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                </div>
                            </div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
