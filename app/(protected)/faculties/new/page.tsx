import type { Metadata } from 'next'
import { AddFacultyPage } from '@/features/faculties/components/add-faculty-page'

export const metadata: Metadata = { title: 'Tambah Fakultas' }

export default function Page() {
  return <AddFacultyPage />
}
