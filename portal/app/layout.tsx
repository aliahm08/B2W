import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '@/app/globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'B2W Client Portal',
  description: 'Secure portal for consultancy proposals, approvals, deliverables, and client collaboration.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
