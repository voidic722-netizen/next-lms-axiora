import type { Metadata } from 'next'
import { ClassroomsPage } from '@/features/classrooms/components/classrooms-page'

export const metadata: Metadata = { title: 'Kelas' }

export default function Page() {
  return <ClassroomsPage />
}
