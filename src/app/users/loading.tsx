import SkeletonCard from '@/components/common/SkeletonCard';

/**
 * Loading State for Users Page
 * 
 * Displays skeleton UI while users data is being fetched.
 * Uses shimmer animation to indicate loading progress.
 */
export default function Loading() {
    return (
        <div className="container mx-auto p-6">
            {/* Page Header Skeleton */}
            <div className="mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>

            {/* Users Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} rows={3} hasImage={true} />
                ))}
            </div>
        </div>
    );
}
