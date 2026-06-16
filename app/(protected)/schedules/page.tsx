import type { Metadata } from 'next'
import { SchedulesPage } from '@/features/schedules/components/schedules-page'

export const metadata: Metadata = { title: 'Jadwal' }

export default function Page() {
  return <SchedulesPage />
}
