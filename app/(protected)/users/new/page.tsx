import type { Metadata } from 'next'
import { AddUserPage } from '@/features/users/components/add-user-page'

export const metadata: Metadata = { title: 'Tambah User' }

export default function Page() {
  return <AddUserPage />
}
