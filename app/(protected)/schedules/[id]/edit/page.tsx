import type { Metadata } from 'next'
import { EditSchedulePage } from '@/features/schedules/components/edit-schedule-page'

export const metadata: Metadata = { title: 'Edit Jadwal' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditSchedulePage id={params.id} />
}
