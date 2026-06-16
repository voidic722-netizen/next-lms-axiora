import type { Metadata } from 'next'
import { ExamsPage } from '@/features/exams/components/exams-page'

export const metadata: Metadata = { title: 'Ujian' }

export default function ExamsListPage() {
  return <ExamsPage />
}
