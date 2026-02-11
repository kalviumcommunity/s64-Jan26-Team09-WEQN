'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

/**
 * AuthContext - Global authentication state management
 * 
 * Provides:
 * - User state (logged in user info)
 * - Login function
 * - Logout function
 * - isAuthenticated boolean
 */

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Hydrate from localStorage on mount (client-side only)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                console.log('[AuthContext] User restored from localStorage');
            } catch (error) {
                console.error('[AuthContext] Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('[AuthContext] User logged in:', userData.email);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('[AuthContext] User logged out');
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access AuthContext
 * Throws error if used outside AuthProvider
 */
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
