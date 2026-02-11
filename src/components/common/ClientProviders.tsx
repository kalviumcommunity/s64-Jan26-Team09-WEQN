'use client';

import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { ReactNode } from 'react';

interface ClientProvidersProps {
    children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <ThemeProvider>
            <ThemeToggle />
            {children}
        </ThemeProvider>
    );
}
