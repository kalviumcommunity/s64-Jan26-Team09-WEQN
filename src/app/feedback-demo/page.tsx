'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';

/**
 * Feedback UI Demo Page
 * Assignment 2.31: Toasts, Modals, and Feedback UI
 * 
 * Demonstrates:
 * - Toast notifications (success, error, loading, info)
 * - Modal dialogs with accessibility
 * - Loaders with ARIA support
 * - Complete user feedback flow
 */
export default function FeedbackDemoPage() {
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Simulate async operation
    const handleAsyncOperation = async () => {
        setIsLoading(true);

        const simulateAPI = () => new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        await toast.promise(simulateAPI(), {
            loading: 'Processing your request...',
            success: 'Operation completed successfully!',
            error: 'Something went wrong!',
        });

        setIsLoading(false);
    };

    // Simulate delete with modal confirmation
    const handleDeleteClick = () => {
        setIsDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        const deleteAPI = () => new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });

        try {
            await toast.promise(deleteAPI(), {
                loading: 'Deleting user...',
                success: 'User deleted successfully!',
                error: 'Failed to delete user!',
            });

            setIsDeleteModal(false);
        } catch (error) {
            // Error handled by toast
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎨 Feedback UI Demo
                    </h1>
                    <p className="text-gray-600">
                        Assignment 2.31: Toasts, Modals, and Loaders
                    </p>
                </div>

                {/* Toast Notifications Section */}
                <div className="bg-white rounded-lg shadowlg p-8 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        📢 Toast Notifications
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Instant, non-blocking feedback for user actions
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => toast.success('This is a success message!')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            ✅ Show Success Toast
                        </button>

                        <button
                            onClick={() => toast.error('This is an error message!')}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                            ❌ Show Error Toast
                        </button>

                        <button
                            onClick={() => toast.info('This is an info message!')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            ℹ️ Show Info Toast
                        </button>

                        <button
                            onClick={() => {
                                const id = toast.loading('Loading indefinitely...');
                                setTimeout(() => toast.dismiss(id), 3000);
                            }}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                            ⏳ Show Loading Toast
                        </button>

                        <button
                            onClick={handleAsyncOperation}
                            disabled={isLoading}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
                        >
                            🚀 Simulate Async Operation (with promise toast)
                        </button>
                    </div>
                </div>

                {/* Modal Dialogs Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        🪟 Modal Dialogs
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Blocking feedback for important confirmations
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            📋 Open Info Modal
                        </button>

                        <button
                            onClick={handleDeleteClick}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                            🗑️ Delete User (with confirmation)
                        </button>
                    </div>

                    {/* Info Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Modal Dialog Example"
                        size="md"
                    >
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                This is an accessible modal dialog with the following features:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>🎯 Focus trap (Tab cycles within modal)</li>
                                <li>⌨️ Esc key closes the modal</li>
                                <li>🖱️ Click outside to dismiss</li>
                                <li>♿ ARIA attributes for accessibility</li>
                                <li>🔒 Body scroll lock when open</li>
                                <li>✨ Smooth animations</li>
                            </ul>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Action confirmed!');
                                        setIsModalOpen(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        isOpen={isDeleteModal}
                        onClose={() => !isDeleting && setIsDeleteModal(false)}
                        title="Confirm Deletion"
                        size="sm"
                    >
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>

                {/* Loaders Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        ⏳ Loaders & Progress Indicators
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Visual feedback for async operations
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="p-6 bg-gray-50 rounded-lg flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Small Blue</p>
                            <Loader size="sm" color="blue" />
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Medium Green</p>
                            <Loader size="md" color="green" text="Loading..." />
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Large Red</p>
                            <Loader size="lg" color="red" text="Processing..." />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                                toast.success('Loading complete!');
                            }, 3000);
                        }}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : '💫 Show Overlay Loader (3 seconds)'}
                    </button>

                    {isLoading && <Loader overlay text="Please wait..." size="lg" />}
                </div>

                {/* Complete Flow Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        🔄 Complete User Feedback Flow
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Toast → Modal → Loader → Toast (demonstration of full feedback cycle)
                    </p>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                            <li>Click "Delete User" button</li>
                            <li>Confirmation modal appears</li>
                            <li>Click "Delete" in modal</li>
                            <li>Loading toast shows progress</li>
                            <li>Success toast confirms completion</li>
                            <li>Modal automatically closes</li>
                        </ol>

                        <p className="text-sm text-gray-600 italic">
                            💡 This flow demonstrates how different feedback elements work together
                            to create a clear, accessible user experience.
                        </p>
                    </div>
                </div>

                {/* Accessibility Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                        ♿ Accessibility Features:
                    </p>
                    <ul className="text-xs text-green-800 space-y-1">
                        <li>✅ Screen reader support (ARIA live regions)</li>
                        <li>✅ Keyboard navigation (Tab, Shift+Tab, Esc)</li>
                        <li>✅ Focus management (trapped in modals)</li>
                        <li>✅ Semantic HTML (role, aria-* attributes)</li>
                        <li>✅ Auto-dismiss timers for toasts</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
