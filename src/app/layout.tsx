import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components';
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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
