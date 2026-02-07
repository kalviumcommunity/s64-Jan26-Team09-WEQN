/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes
 * 
 * Props:
 * - label: Button text
 * - onClick: Click handler
 * - variant: 'primary' | 'secondary' | 'danger' | 'success'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: Boolean
 * - fullWidth: Boolean
 */

interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    label,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    type = 'button',
}: ButtonProps) {
    // Variant styles
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    // Combine classes
    const classes = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    font-semibold rounded-lg 
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    shadow-md hover:shadow-lg
    active:scale-95
  `.trim().replace(/\s+/g, ' ');

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {label}
        </button>
    );
}
