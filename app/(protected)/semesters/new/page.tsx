import type { Metadata } from 'next'
import { AddSemesterPage } from '@/features/semesters/components/add-semester-page'

export const metadata: Metadata = { title: 'Tambah Semester' }

export default function Page() {
  return <AddSemesterPage />
}
