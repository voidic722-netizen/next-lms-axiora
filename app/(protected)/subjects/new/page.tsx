import type { Metadata } from 'next'
import { AddSubjectPage } from '@/features/subjects/components/add-subject-page'

export const metadata: Metadata = { title: 'Tambah Mata Pelajaran' }

export default function Page() {
  return <AddSubjectPage />
}
