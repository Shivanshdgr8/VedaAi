import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'Veda AI Assessment Creator',
  description: 'AI-powered assessment creator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
