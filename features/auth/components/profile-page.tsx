'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import { updateProfileService } from '@/services/auth-service'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { USER_ROLE_LABEL } from '@/types/roles'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const fields = [
    { label: 'Email', value: user.email },
    ...(user.nidn ? [{ label: 'NIDN', value: user.nidn }] : []),
    ...(user.nim ? [{ label: 'NIM', value: user.nim }] : []),
    ...(user.position ? [{ label: 'Posisi', value: user.position }] : []),
    ...(user.faculty ? [{ label: 'Fakultas', value: user.faculty.name }] : []),
    ...(user.department ? [{ label: 'Jurusan', value: user.department.name }] : []),
    ...(user.classroom ? [{ label: 'Kelas', value: user.classroom.name }] : []),
    ...(user.subject ? [{ label: 'Mata Pelajaran', value: user.subject.name }] : []),
  ]

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader
        title="Profil Saya"
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/profile/edit"><Pencil className="mr-2 h-4 w-4" />Edit Profil</Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <Badge variant="secondary" className="mt-1">{USER_ROLE_LABEL[user.role]}</Badge>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            {fields.map((f) => (
              <div key={f.label} className="grid grid-cols-5 gap-2 text-sm">
                <span className="text-muted-foreground col-span-2">{f.label}</span>
                <span className="font-medium col-span-3">{f.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const profileSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function EditProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const setUser = useAuthStore((s) => s.setUser)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) => updateProfileService(values),
    onSuccess: (_, values) => {
      if (user) {
        setUser({ ...user, name: values.name, email: values.email })
      }
      qc.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success('Profil berhasil diperbarui')
      router.push('/profile')
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Gagal memperbarui profil'
      toast.error(message)
    },
  })

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="Edit Profil" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Nama</Label>
              <Input id="p-name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}