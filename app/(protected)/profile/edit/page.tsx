import type { Metadata } from 'next'
import { EditProfilePage } from '@/features/auth/components/edit-profile-page'

export const metadata: Metadata = { title: 'Edit Profil' }

export default function Page() {
  return <EditProfilePage />
}
