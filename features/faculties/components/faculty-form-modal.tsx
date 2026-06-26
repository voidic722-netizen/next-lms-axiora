'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FacultyFormFields } from './faculty-form-fields'
import { useCreateFaculty, useUpdateFaculty } from '../hooks/use-faculties'
import { facultySchema, type FacultyFormValues } from '../schemas/faculty-schema'
import type { Faculty } from '@/types/faculty'
import { handleApiError } from '@/lib/error-handler'

interface FacultyFormModalProps {
  isOpen: boolean
  onClose: () => void
  faculty?: Faculty | null
}

export function FacultyFormModal({ isOpen, onClose, faculty }: FacultyFormModalProps) {
  const isEditing = !!faculty
  const createMutation = useCreateFaculty()
  const updateMutation = useUpdateFaculty(faculty?.id ?? 0)
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    values: faculty
      ? { name: faculty.name, description: faculty.description }
      : { name: '', description: '' },
  })

  async function onSubmit(values: FacultyFormValues) {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(values)
      } else {
        await createMutation.mutateAsync(values)
      }
      form.reset()
      onClose()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Fakultas' : 'Tambah Fakultas'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FacultyFormFields form={form} existingThumbnail={faculty?.thumbnail} />
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Simpan Perubahan' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
