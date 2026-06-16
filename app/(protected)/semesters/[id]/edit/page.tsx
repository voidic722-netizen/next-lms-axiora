import type { Metadata } from 'next'
import { EditSemesterPage } from '@/features/semesters/components/edit-semester-page'

export const metadata: Metadata = { title: 'Edit Semester' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditSemesterPage id={params.id} />
}
