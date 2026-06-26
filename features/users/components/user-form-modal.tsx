'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleApiError } from '@/lib/error-handler'
import { UserFormFields } from './user-form-fields'
import { useCreateUser, useUpdateUser, useUserReferenceData } from '../hooks/use-users'
import { createUserSchema, updateUserSchema } from '../schemas/user-schema'
import type { CreateUserFormValues, UpdateUserFormValues } from '../schemas/user-schema'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'

export function UserFormModal({ isOpen, onClose, user }: {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}) {
  const isEditing = !!user
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser(user?.id ?? 0)
  const refData = useUserReferenceData()

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema) as never,
    values: (user
      ? {
          name: user.name,
          email: user.email,
          role: user.role as "1" | "2" | "3",
          ...(user.role === '2' && {
            position: (user.position ?? undefined) as "dosen" | "kaprodi" | "dekan" | undefined,
            nidn: user.nidn ?? undefined,
            facultyId: user.facultyId ?? undefined,
            departmentId: user.departmentId ?? undefined,
            subjectId: user.subjectId ?? undefined,
          }),
          ...(user.role === '3' && {
            nim: user.nim ?? undefined,
            facultyId: user.facultyId ?? undefined,
            departmentId: user.departmentId ?? undefined,
            classroomId: user.classroomId ?? undefined,
          }),
        }
      : { role: '1' as const }) as any,
  })

  async function onSubmit(values: CreateUserFormValues | UpdateUserFormValues) {
    try {
      if (isEditing) {
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
        await updateMutation.mutateAsync({ payload })
      } else {
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
        await createMutation.mutateAsync(payload)
      }
      form.reset()
      onClose()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Tambah User'}</DialogTitle>
        </DialogHeader>
        {!refData.isLoading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <UserFormFields
                form={form as never}
                faculties={refData.faculties}
                departments={refData.departments}
                classrooms={refData.classrooms}
                subjects={refData.subjects}
                isCreate={!isEditing}
              />
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Batal</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
