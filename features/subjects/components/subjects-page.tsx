'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, BookText, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { withStorageUrl } from '@/lib/storage'
import { subjectSchema, type SubjectFormValues } from '../schemas/subject-schema'
import {
  useSubjects, useSubjectDetail, useCreateSubject,
  useUpdateSubject, useDeleteSubject,
} from '../hooks/use-subjects'
import { useDepartments } from '@/features/departments/hooks/use-departments'
import type { Subject } from '@/types/subject'

export function SubjectsPage() {
  const { isAdmin } = useAuth()
  const { data: subjects = [], isLoading } = useSubjects()
  const deleteMutation = useDeleteSubject()

  if (isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg bg-[#E2E8F0]" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mata Pelajaran"
        description={`${subjects.length} mata pelajaran`}
        action={
          isAdmin ? (
            <Button asChild size="sm">
              <Link href="/subjects/new">
                <Plus className="mr-2 h-4 w-4" />Tambah
              </Link>
            </Button>
          ) : undefined
        }
      />
      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <BookText className="h-12 w-12 text-[#64748B]/40" />
          <p className="text-[#64748B]">Belum ada mata pelajaran</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} isAdmin={isAdmin} onDelete={() => deleteMutation.mutateAsync(s.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function SubjectCard({
  subject: s,
  isAdmin,
  onDelete,
}: {
  subject: Subject
  isAdmin: boolean
  onDelete: () => Promise<void>
}) {
  const thumb = withStorageUrl(s.thumbnail)
  return (
    <Card className="overflow-hidden group border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <Link href={`/subjects/${s.id}`}>
        <div className="aspect-video bg-[#F8FAFC]">
          {thumb ? (
            <img
              src={thumb}
              alt={s.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookText className="h-10 w-10 text-[#64748B]/30" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/subjects/${s.id}`}>
            <h3 className="font-semibold text-[#0F172A] truncate hover:underline">{s.name}</h3>
          </Link>
          <Badge variant={s.type === 'wajib' ? 'default' : 'secondary'} className="shrink-0">
            {s.type}
          </Badge>
        </div>
        <p className="text-sm text-[#64748B] line-clamp-2 mt-1">{s.description}</p>
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/subjects/${s.id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#EF4444] border-[#EF4444]/30 hover:border-[#EF4444]/50 hover:text-[#DC2626]"
                >
                  Hapus
                </Button>
              }
              title="Hapus Mata Pelajaran"
              description={`Yakin menghapus "${s.name}"?`}
              confirmLabel="Hapus"
              onConfirm={onDelete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SubjectDetailPage({ id }: { id: string }) {
  const { data: subject, isLoading } = useSubjectDetail(id)
  if (isLoading) return <Skeleton className="h-64 rounded-lg bg-[#E2E8F0]" />
  if (!subject) return <p className="text-[#64748B]">Mata pelajaran tidak ditemukan.</p>
  const thumb = withStorageUrl(subject.thumbnail)
  return (
    <div className="space-y-6">
      <PageHeader title={subject.name} />
      <Card>
        <CardContent className="pt-4 space-y-4">
          {thumb && (
            <img src={thumb} alt={subject.name} className="w-full max-h-64 object-cover rounded-lg" />
          )}
          <div className="flex items-center gap-2">
            <Badge variant={subject.type === 'wajib' ? 'default' : 'secondary'}>{subject.type}</Badge>
          </div>
          <p className="text-sm text-[#0F172A]">{subject.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SubjectForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  defaultValues?: Partial<SubjectFormValues>
  onSubmit: (v: SubjectFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const { data: departments = [] } = useDepartments()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues,
  })
  const type = watch('type')
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nama</Label>
        <Input placeholder="Algoritma & Pemrograman" {...register('name')} />
        {errors.name && <p className="text-xs text-[#EF4444]">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Tipe</Label>
        <Select value={type} onValueChange={(v) => setValue('type', v as 'umum' | 'wajib')}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wajib">Wajib</SelectItem>
            <SelectItem value="umum">Umum</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-[#EF4444]">{errors.type.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Textarea rows={3} {...register('description')} />
        {errors.description && <p className="text-xs text-[#EF4444]">{errors.description.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Jurusan (opsional)</Label>
        <Select onValueChange={(v) => setValue('departmentId', Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jurusan" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Thumbnail (opsional)</Label>
        {preview ? (
          <img src={preview} alt="preview" className="h-32 rounded border border-[#E2E8F0] object-cover" />
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Pilih Gambar
          </Button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            setValue('thumbnail', f)
            setPreview(URL.createObjectURL(f))
          }}
        />
      </div>
      <div className="flex gap-3">
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

export function AddSubjectPage() {
  const router = useRouter()
  const mutation = useCreateSubject()
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Tambah Mata Pelajaran" />
      <Card>
        <CardContent className="pt-6">
          <SubjectForm
            onSubmit={async (v) => {
              await mutation.mutateAsync(v)
              router.push('/subjects')
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

export function EditSubjectPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: subject, isLoading } = useSubjectDetail(id)
  const mutation = useUpdateSubject(Number(id))
  if (isLoading) return <Skeleton className="h-96 rounded-lg max-w-xl bg-[#E2E8F0]" />
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Edit Mata Pelajaran" />
      <Card>
        <CardContent className="pt-6">
          <SubjectForm
            defaultValues={
              subject
                ? {
                    name: subject.name,
                    type: subject.type,
                    description: subject.description,
                    departmentId: subject.departmentId ?? undefined,
                  }
                : undefined
            }
            onSubmit={async (v) => {
              await mutation.mutateAsync(v)
              router.push(`/subjects/${id}`)
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