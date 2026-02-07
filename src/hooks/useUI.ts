import { useUIContext } from '@/context/UIContext';

/**
 * useUI Hook
 * 
 * Custom hook to access UI state and actions
 * Provides a clean API for components to consume UI context
 * 
 * Returns:
 * - theme: 'light' | 'dark'
 * - toggleTheme: Function to toggle theme
 * - sidebarOpen: boolean
 * - toggleSidebar: Function to toggle sidebar
 */
export function useUI() {
    const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIContext();

    return {
        theme,
        toggleTheme,
        sidebarOpen,
        toggleSidebar,
    };
}
