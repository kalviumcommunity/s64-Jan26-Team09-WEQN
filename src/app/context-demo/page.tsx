'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Button, Card } from '@/components';

/**
 * Context Demo Page
 * 
 * Demonstrates state management using:
 * - AuthContext (login/logout)
 * - UIContext (theme toggle, sidebar toggle)
 */
export default function ContextDemoPage() {
    const { user, login, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

    const handleLogin = () => {
        login({
            id: '1',
            name: 'Demo User',
            email: 'demo@weqn.hospital',
            role: 'ADMIN',
        });
    };

    return (
        <main className={`min-h-screen transition-colors ${theme === 'dark'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-900'
            }`}>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-bold mb-2">
                    State Management Demo
                </h1>
                <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Context API + Custom Hooks for global state
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Authentication Card */}
                    <Card
                        title="🔐 Authentication State"
                        className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}
                    >
                        {isAuthenticated ? (
                            <div className="space-y-4">
                                <div className={`p-4 rounded ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                                    <p className="font-semibold">Logged in as:</p>
                                    <p className="text-lg">{user?.name}</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {user?.email}
                                    </p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium">
                                        {user?.role}
                                    </span>
                                </div>
                                <Button
                                    label="Logout"
                                    variant="danger"
                                    onClick={logout}
                                    fullWidth
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    No user logged in
                                </p>
                                <Button
                                    label="Login as Demo User"
                                    variant="success"
                                    onClick={handleLogin}
                                    fullWidth
                                />
                            </div>
                        )}
                    </Card>

                    {/* UI Controls Card */}
                    <Card
                        title="🎨 UI Controls"
                        className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <p className="font-semibold">Current Theme:</p>
                                <p className="text-2xl capitalize">{theme}</p>
                            </div>

                            <Button
                                label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                                variant="primary"
                                onClick={toggleTheme}
                                fullWidth
                            />

                            <div className="pt-4 border-t">
                                <p className="font-semibold mb-2">Sidebar State:</p>
                                <p className={`mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {sidebarOpen ? '✅ Open' : '❌ Closed'}
                                </p>
                                <Button
                                    label={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                                    variant="secondary"
                                    onClick={toggleSidebar}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Console Logs Card */}
                <Card
                    title="📋 Console Logs"
                    className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}
                >
                    <div className={`p-4 rounded font-mono text-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            Open your browser console (F12) to see state change logs:
                        </p>
                        <ul className={`mt-2 space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• [AuthContext] User logged in: ...</li>
                            <li>• [AuthContext] User logged out</li>
                            <li>• [UIContext] Theme toggled to: dark</li>
                            <li>• [UIContext] Sidebar toggled: open</li>
                        </ul>
                    </div>
                </Card>

                {/* Benefits Card */}
                <Card
                    title="✨ Benefits of Context + Hooks"
                    className={`mt-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
                >
                    <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <li>✅ <strong>No prop drilling</strong> - Access state anywhere</li>
                        <li>✅ <strong>Centralized state</strong> - Single source of truth</li>
                        <li>✅ <strong>Clean components</strong> - Custom hooks abstract logic</li>
                        <li>✅ <strong>Persistent state</strong> - localStorage integration</li>
                        <li>✅ <strong>Type-safe</strong> - TypeScript interfaces</li>
                    </ul>
                </Card>
            </div>
        </main>
    );
}
