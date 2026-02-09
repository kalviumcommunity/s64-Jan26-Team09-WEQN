/**
 * Loader Component
 * Assignment 2.31: Toasts, Modals, and Feedback UI
 * 
 * Features:
 * - Spinner with smooth animation
 * - Customizable size and color
 * - ARIA live region for screen readers
 * - Optional text label
 * - Overlay mode for blocking UI
 */

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'red' | 'gray';
    text?: string;
    overlay?: boolean;
}

export default function Loader({
    size = 'md',
    color = 'blue',
    text,
    overlay = false,
}: LoaderProps) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const colorClasses = {
        blue: 'border-blue-600 border-t-transparent',
        green: 'border-green-600 border-t-transparent',
        red: 'border-red-600 border-t-transparent',
        gray: 'border-gray-600 border-t-transparent',
    };

    const spinner = (
        <div
            className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        rounded-full animate-spin
      `}
            role="status"
            aria-busy="true"
            aria-live="polite"
        >
            <span className="sr-only">{text || 'Loading...'}</span>
        </div>
    );

    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            {spinner}
            {text && (
                <p className="text-sm font-medium text-gray-700">{text}</p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-lg p-8 shadow-xl">
                    {content}
                </div>
            </div>
        );
    }

    return content;
}
