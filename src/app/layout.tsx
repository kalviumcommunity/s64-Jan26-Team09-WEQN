import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components';
import { ThemedLayout } from '@/components/common/ThemedLayout';
import { Toaster } from 'react-hot-toast';
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemedLayout>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: 'white',
                },
              },
            }}
          />
        </ThemedLayout>
      </body>
    </html>
  );
}
