import type { Metadata } from 'next'
import { TeacherDashboard } from '@/features/auth/components/teacher-dashboard'

export const metadata: Metadata = { title: 'Dashboard Pengajar' }

export default function Page() {
  return <TeacherDashboard />
}
