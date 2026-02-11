import { useAuthContext } from '@/context/AuthContext';

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication state and actions
 * Provides a clean API for components to consume auth context
 * 
 * Returns:
 * - isAuthenticated: boolean
 * - user: User object or null
 * - login: Function to log in user
 * - logout: Function to log out user
 */
export function useAuth() {
    const { user, login, logout, isAuthenticated } = useAuthContext();

    return {
        isAuthenticated,
        user,
        login,
        logout,
    };
}
