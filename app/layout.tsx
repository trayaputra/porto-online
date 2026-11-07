import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/lib/supabase/provider';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionConfig } from 'framer-motion';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Traya Putra | Full Stack Developer',
  description: 'Futuristic, interactive, and premium portfolio of a modern Full Stack Developer.',
  openGraph: {
    title: 'Traya Putra | Full Stack Developer',
    description: 'Building modern, secure, and realtime web applications.',
    url: 'https://porto-online.vercel.app',
    siteName: 'Porto Online',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-bg-primary text-foreground`}> 
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseProvider>
            <MotionConfig reducedMotion="user">
              {children}
            </MotionConfig>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}