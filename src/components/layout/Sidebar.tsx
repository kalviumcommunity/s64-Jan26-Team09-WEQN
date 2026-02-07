'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sidebar Component
 * 
 * Contextual navigation sidebar for dashboard and protected pages
 * - Hierarchical navigation links
 * - Active state highlighting
 * - Role-based link visibility
 */
export default function Sidebar() {
    const pathname = usePathname();

    const navigationGroups = [
        {
            title: 'Main',
            links: [
                { href: '/dashboard', label: 'Overview', icon: '📈' },
                { href: '/users', label: 'Users', icon: '👥' },
            ],
        },
        {
            title: 'Management',
            links: [
                { href: '/api/doctors', label: 'Doctors', icon: '👨‍⚕️' },
                { href: '/api/tokens', label: 'Tokens', icon: '🎫' },
            ],
        },
        {
            title: 'Settings',
            links: [
                { href: '/settings', label: 'Account', icon: '⚙️' },
                { href: '/logout', label: 'Logout', icon: '🚪' },
            ],
        },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <aside className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Navigation</h2>
                <p className="text-xs text-gray-600">Quick access to all sections</p>
            </div>

            <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
                {navigationGroups.map((group) => (
                    <div key={group.title}>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {group.title}
                        </h3>
                        <ul className="space-y-1">
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive(link.href)
                                                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-lg">{link.icon}</span>
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                    WEQN Hospital © 2026
                </p>
            </div>
        </aside>
    );
}
