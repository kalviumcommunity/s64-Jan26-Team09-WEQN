interface SkeletonCardProps {
    className?: string;
    rows?: number;
    hasImage?: boolean;
}

/**
 * SkeletonCard Component
 * 
 * Reusable skeleton loader for card-based content.
 * Uses Tailwind's animate-pulse for shimmer effect.
 * 
 * @param className - Additional CSS classes
 * @param rows - Number of text rows to display (default: 3)
 * @param hasImage - Whether to show image placeholder (default: false)
 */
export default function SkeletonCard({
    className = '',
    rows = 3,
    hasImage = false
}: SkeletonCardProps) {
    return (
        <div className={`animate-pulse space-y-4 p-6 bg-white dark:bg-dark-bg-secondary rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Image placeholder */}
            {hasImage && (
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
            )}

            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />

            {/* Text rows */}
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i === rows - 1 ? 'w-1/2' : 'w-full'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
