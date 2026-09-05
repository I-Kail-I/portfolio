import type { Metadata } from 'next';
import { Geist, Geist_Mono, Nunito, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/components/provider';
import { cn } from '@/lib/utils';
import './globals.css';
import { Layout } from '@/components/layout/layout';
import { Toaster } from '@/components/ui/toast';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['cyrillic-ext', 'latin', 'latin-ext', 'vietnamese'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
});

const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  variable: '--font-nunito',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mikail Arianos — Fullstack Web Dev & DevOps',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        plusJakartaSans.variable,
        nunito.variable,
      )}
    >
      <Providers>
        <body className='flex min-h-full flex-col' suppressHydrationWarning>
          <Layout>{children}</Layout>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
