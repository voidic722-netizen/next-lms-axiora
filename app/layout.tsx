import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/query-provider'
import { ToastProvider } from '@/providers/toast-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Axiora',
    template: '%s | Axiora',
  },
  description: 'Learning Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased">
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  )
}