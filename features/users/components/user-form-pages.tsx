'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { UserFormFields } from './user-form-fields'
import { useCreateUser, useUpdateUser, useUsers, useUserReferenceData } from '@/hooks/use-users'
import { createUserSchema, updateUserSchema } from '@/schemas/user-schema'
import type { CreateUserFormValues, UpdateUserFormValues } from '@/schemas/user-schema'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user'

// ── Add User ─────────────────────────────────────────────────────────────────
export function AddUserPage() {
  const router = useRouter()
  const mutation = useCreateUser()
  const refData = useUserReferenceData()

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema) as never,
    defaultValues: { role: '1' as const },
  })

  async function onSubmit(values: CreateUserFormValues) {
    const payload: CreateUserPayload = {
      name: values.name,
      email: values.email,
      password: (values as { password: string }).password,
      role: values.role,
      ...(values.role === '2' && {
        position: (values as { position?: string }).position as CreateUserPayload['position'],
        nidn: (values as { nidn?: string }).nidn,
        facultyId: (values as { facultyId?: number }).facultyId,
        departmentId: (values as { departmentId?: number }).departmentId,
        subjectId: (values as { subjectId?: number }).subjectId,
      }),
      ...(values.role === '3' && {
        nim: (values as { nim?: string }).nim,
        facultyId: (values as { facultyId?: number }).facultyId,
        departmentId: (values as { departmentId?: number }).departmentId,
        classroomId: (values as { classroomId?: number }).classroomId,
      }),
    }
    await mutation.mutateAsync(payload)
    router.push('/users')
  }

  if (refData.isLoading) return <Skeleton className="h-[500px] max-w-2xl rounded-lg" />

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Tambah User" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields
              form={form as never}
              faculties={refData.faculties}
              departments={refData.departments}
              classrooms={refData.classrooms}
              subjects={refData.subjects}
              isCreate
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Edit User ────────────────────────────────────────────────────────────────
export function EditUserPage({ id }: { id: string }) {
  const router = useRouter()
  const numericId = parseInt(id, 10)
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const mutation = useUpdateUser(numericId)
  const refData = useUserReferenceData()

  const currentUser = users.find((u) => u.id === numericId)

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema) as never,
    values: currentUser
      ? {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          ...(currentUser.role === '2' && {
            position: currentUser.position ?? undefined,
            nidn: currentUser.nidn ?? undefined,
            facultyId: currentUser.facultyId ?? undefined,
            departmentId: currentUser.departmentId ?? undefined,
            subjectId: currentUser.subjectId ?? undefined,
          }),
          ...(currentUser.role === '3' && {
            nim: currentUser.nim ?? undefined,
            facultyId: currentUser.facultyId ?? undefined,
            departmentId: currentUser.departmentId ?? undefined,
            classroomId: currentUser.classroomId ?? undefined,
          }),
        }
      : undefined,
  })

  async function onSubmit(values: UpdateUserFormValues) {
    const payload: UpdateUserPayload = {
      name: values.name,
      email: values.email,
      role: values.role,
      password: (values as { password?: string }).password || undefined,
      ...(values.role === '2' && {
        position: (values as { position?: string }).position as UpdateUserPayload['position'],
        nidn: (values as { nidn?: string }).nidn,
        facultyId: (values as { facultyId?: number }).facultyId,
        departmentId: (values as { departmentId?: number }).departmentId,
        subjectId: (values as { subjectId?: number }).subjectId,
      }),
      ...(values.role === '3' && {
        nim: (values as { nim?: string }).nim,
        facultyId: (values as { facultyId?: number }).facultyId,
        departmentId: (values as { departmentId?: number }).departmentId,
        classroomId: (values as { classroomId?: number }).classroomId,
      }),
    }
    await mutation.mutateAsync({ payload })
    router.push('/users')
  }

  if (usersLoading || refData.isLoading) return <Skeleton className="h-[500px] max-w-2xl rounded-lg" />

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Edit User" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields
              form={form as never}
              faculties={refData.faculties}
              departments={refData.departments}
              classrooms={refData.classrooms}
              subjects={refData.subjects}
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
