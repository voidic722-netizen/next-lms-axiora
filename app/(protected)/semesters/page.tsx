import type { Metadata } from 'next'
import { SemestersPage } from '@/features/semesters/components/semesters-page'

export const metadata: Metadata = { title: 'Semester' }

export default function Page() {
  return <SemestersPage />
}
