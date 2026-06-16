import type { Metadata } from 'next'
import { AddAssignmentPage } from '@/features/assignments/components/add-assignment-page'

export const metadata: Metadata = { title: 'Tambah Tugas' }

export default function Page() {
  return <AddAssignmentPage />
}
