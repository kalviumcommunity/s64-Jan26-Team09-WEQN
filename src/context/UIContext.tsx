'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

/**
 * UIContext - Global UI state management
 * 
 * Provides:
 * - Theme state (light/dark)
 * - Sidebar visibility
 * - Toggle functions for both
 */

interface UIContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Persist theme to localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            setTheme(storedTheme);
            console.log('[UIContext] Theme restored:', storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            console.log('[UIContext] Theme toggled to:', newTheme);
            return newTheme;
        });
    };

    const toggleSidebar = () => {
        setSidebarOpen((prev) => {
            const newState = !prev;
            console.log('[UIContext] Sidebar toggled:', newState ? 'open' : 'closed');
            return newState;
        });
    };

    const value: UIContextType = {
        theme,
        toggleTheme,
        sidebarOpen,
        toggleSidebar,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}

/**
 * Hook to access UIContext
 * Throws error if used outside UIProvider
 */
export function useUIContext() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
}
