import type { Metadata } from 'next'
import { StudentDashboard } from '@/features/auth/components/student-dashboard'

export const metadata: Metadata = {
  title: 'Beranda',
}

export default function HomePage() {
  return <StudentDashboard />
}
