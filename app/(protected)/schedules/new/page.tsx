import type { Metadata } from 'next'
import { AddSchedulePage } from '@/features/schedules/components/add-schedule-page'

export const metadata: Metadata = { title: 'Tambah Jadwal' }

export default function Page() {
  return <AddSchedulePage />
}
