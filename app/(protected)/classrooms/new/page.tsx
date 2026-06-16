import type { Metadata } from 'next'
import { AddClassroomPage } from '@/features/classrooms/components/add-classroom-page'

export const metadata: Metadata = { title: 'Tambah Kelas' }

export default function Page() {
  return <AddClassroomPage />
}
