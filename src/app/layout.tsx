import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'WEQN Hospital - Queue Management',
  description: 'A serverless, cloud-native queue management system for hospitals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UIProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
