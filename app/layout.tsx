import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/lib/supabase-provider'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Traya Putra | Portfolio Online',
  description: 'Full-stack developer & designer building modern web experiences with Next.js, Supabase, and Framer Motion.',
  openGraph: {
    title: 'Traya Putra | Portfolio Online',
    description: 'Full-stack developer & designer building modern web experiences with Next.js, Supabase, and Framer Motion.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-bg-primary text-foreground`}> 
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseProvider>
            <MotionConfig reducedMotion="user">
              {children}
            </MotionConfig>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}