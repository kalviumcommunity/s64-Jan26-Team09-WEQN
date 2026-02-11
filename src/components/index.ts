/**
 * Component Barrel Exports
 * 
 * Simplifies imports across the application
 * 
 * Usage:
 * import { Header, Sidebar, Button, Card } from '@/components';
 */

// Common Components
export { default as Button } from './common/Button';
export { default as Card } from './common/Card';
export { ThemeProvider } from './common/ThemeProvider';
export { ThemeToggle } from './common/ThemeToggle';
export { default as SkeletonCard } from './common/SkeletonCard';
export { default as ErrorFallback } from './common/ErrorFallback';

// Layout Components
export { default as Header } from './layout/Header';
export { default as Sidebar } from './layout/Sidebar';
export { default as LayoutWrapper } from './layout/LayoutWrapper';

// Auth Components
// export { default as LoginForm } from './auth/LoginForm';
// export { default as RegisterForm } from './auth/RegisterForm';
// export { default as ProtectedRoute } from './auth/ProtectedRoute';

// Dashboard Components (to be added)
// export { default as DashboardCard } from './dashboard/DashboardCard';
// export { default as QueueDisplay } from './dashboard/QueueDisplay';

// Note: Some components are commented out as they haven't been created yet
// Uncomment and add as development progresses
