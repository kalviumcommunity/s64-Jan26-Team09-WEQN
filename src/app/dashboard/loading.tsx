import SkeletonCard from '@/components/common/SkeletonCard';

/**
 * Loading State for Dashboard Page
 * 
 * Displays skeleton UI while dashboard data is being fetched.
 * Shows placeholders for stats cards and queue information.
 */
export default function Loading() {
    return (
        <div className="container mx-auto p-6">
            {/* Dashboard Header Skeleton */}
            <div className="mb-8 animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-white dark:bg-dark-bg-secondary p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard rows={5} className="h-96" />
                <SkeletonCard rows={5} className="h-96" />
            </div>
        </div>
    );
}
