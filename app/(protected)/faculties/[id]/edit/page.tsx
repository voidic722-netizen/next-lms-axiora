import type { Metadata } from 'next'
import { EditFacultyPage } from '@/features/faculties/components/edit-faculty-page'

export const metadata: Metadata = { title: 'Edit Fakultas' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditFacultyPage id={params.id} />
}
