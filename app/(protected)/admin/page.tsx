import type { Metadata } from 'next'
import { AdminDashboard } from '@/features/auth/components/admin-dashboard'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function Page() {
  return <AdminDashboard />
}
