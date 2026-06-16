import type { Metadata } from 'next'
import { FacultiesPage } from '@/features/faculties/components/faculties-page'

export const metadata: Metadata = { title: 'Fakultas' }

export default function Page() {
  return <FacultiesPage />
}
