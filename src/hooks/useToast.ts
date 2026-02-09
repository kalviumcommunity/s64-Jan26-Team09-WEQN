import toast from 'react-hot-toast';

/**
 * Custom Toast Hook
 * Assignment 2.31: Toasts, Modals, and Feedback UI
 * 
 * Wrapper around react-hot-toast for consistent styling and usage
 */

export const useToast = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            duration: 3000,
            style: {
                background: '#10b981',
                color: 'white',
                fontWeight: '500',
            },
            iconTheme: {
                primary: 'white',
                secondary: '#10b981',
            },
        });
    };

    const showError = (message: string) => {
        toast.error(message, {
            duration: 5000,
            style: {
                background: '#ef4444',
                color: 'white',
                fontWeight: '500',
            },
            iconTheme: {
                primary: 'white',
                secondary: '#ef4444',
            },
        });
    };

    const showLoading = (message: string) => {
        return toast.loading(message, {
            style: {
                background: '#3b82f6',
                color: 'white',
                fontWeight: '500',
            },
        });
    };

    const showInfo = (message: string) => {
        toast(message, {
            duration: 4000,
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: 'white',
                fontWeight: '500',
            },
        });
    };

    const showPromise = async <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, messages, {
            style: {
                fontWeight: '500',
            },
            success: {
                style: {
                    background: '#10b981',
                    color: 'white',
                },
            },
            error: {
                style: {
                    background: '#ef4444',
                    color: 'white',
                },
            },
            loading: {
                style: {
                    background: '#3b82f6',
                    color: 'white',
                },
            },
        });
    };

    const dismiss = (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    };

    return {
        success: showSuccess,
        error: showError,
        loading: showLoading,
        info: showInfo,
        promise: showPromise,
        dismiss,
    };
};
