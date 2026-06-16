'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { semesterSchema, type SemesterFormValues } from '@/features/semesters/schemas/semester-schema'
import { useCreateSemester, useUpdateSemester, useSemesters } from '@/features/semesters/hooks/use-semesters'

function SemesterForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  defaultValues?: Partial<SemesterFormValues>
  onSubmit: (v: SemesterFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sem-name">Nama Semester</Label>
        <Input id="sem-name" placeholder="Semester Ganjil" {...register('name')} />
        {errors.name && <p className="text-xs text-[#EF4444]">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sem-year">Tahun Akademik</Label>
        <Input id="sem-year" placeholder="2024/2025" {...register('academicYear')} />
        {errors.academicYear && (
          <p className="text-xs text-[#EF4444]">{errors.academicYear.message}</p>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  )
}

export function AddSemesterPage() {
  const router = useRouter()
  const mutation = useCreateSemester()

  return (
    <div className="space-y-6 max-w-md">
      <PageHeader title="Tambah Semester" />
      <Card>
        <CardContent className="pt-6">
          <SemesterForm
            onSubmit={async (v) => {
              await mutation.mutateAsync(v)
              router.push('/semesters')
            }}
            isPending={mutation.isPending}
            submitLabel="Simpan"
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export function EditSemesterPage({ id }: { id: string }) {
  const router = useRouter()
  const numericId = parseInt(id, 10)
  const { data: semesters = [], isLoading } = useSemesters()
  const mutation = useUpdateSemester(numericId)

  const semester = semesters.find((s) => s.id === numericId)

  if (isLoading) return <Skeleton className="h-64 max-w-md rounded-lg bg-[#E2E8F0]" />

  return (
    <div className="space-y-6 max-w-md">
      <PageHeader title="Edit Semester" />
      <Card>
        <CardContent className="pt-6">
          <SemesterForm
            defaultValues={
              semester
                ? { name: semester.name, academicYear: semester.academicYear }
                : undefined
            }
            onSubmit={async (v) => {
              await mutation.mutateAsync(v)
              router.push('/semesters')
            }}
            isPending={mutation.isPending}
            submitLabel="Simpan Perubahan"
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  )
}