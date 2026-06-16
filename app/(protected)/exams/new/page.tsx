import type { Metadata } from 'next'
import { AddExamPage } from '@/features/exams/components/add-exam-page'

export const metadata: Metadata = { title: 'Tambah Ujian' }

export default function Page() {
  return <AddExamPage />
}
