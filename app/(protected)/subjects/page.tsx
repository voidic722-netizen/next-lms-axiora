import type { Metadata } from 'next'
import { SubjectsPage } from '@/features/subjects/components/subjects-page'

export const metadata: Metadata = { title: 'Mata Pelajaran' }

export default function SubjectsListPage() {
  return <SubjectsPage />
}
