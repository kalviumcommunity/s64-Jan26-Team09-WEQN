'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Header Component
 * 
 * Global navigation header displayed on all pages
 * - Brand logo/title
 * - Primary navigation links
 * - Responsive design
 */
export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/users', label: 'Users', icon: '👥' },
        { href: '/login', label: 'Login', icon: '🔐' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl">🏥</span>
                    <h1 className="text-xl font-bold">WEQN Hospital</h1>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all font-medium ${isActive(link.href)
                                    ? 'bg-white text-blue-600 shadow-md'
                                    : 'hover:bg-blue-500 hover:shadow'
                                }`}
                        >
                            <span>{link.icon}</span>
                            <span className="hidden md:inline">{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
