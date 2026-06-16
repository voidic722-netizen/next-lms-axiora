'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSubjectDetail } from '@/features/subjects/hooks/use-subjects'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import { useAssignments } from '@/features/assignments/hooks/use-assignments'
import { useExams } from '@/features/exams/hooks/use-exams'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/format-date'
import { School, LayoutList, GraduationCap } from 'lucide-react'

export function SubjectClassesPage({ id }: { id: string }) {
  const { data: subject } = useSubjectDetail(id)
  const { data: classrooms = [], isLoading } = useClassrooms()
  const filtered = useMemo(
    () => classrooms.filter((c) => c.subjectId === Number(id)),
    [classrooms, id],
  )
  if (isLoading) return <PageSkeleton />
  return (
    <div className="space-y-6">
      <PageHeader title={`Kelas — ${subject?.name ?? '...'}`} description={`${filtered.length} kelas`} />
      {filtered.length === 0
        ? <EmptyState icon={<School className="h-12 w-12" />} text="Belum ada kelas untuk mata pelajaran ini" />
        : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Link key={c.id} href={`/classrooms/${c.id}`}>
                <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200 h-full">
                  <CardContent className="pt-4 flex items-center gap-3">
                    <School className="h-5 w-5 text-[#4B5CF0] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#0F172A]">{c.name}</p>
                      <p className="text-xs text-[#64748B]">{c.semester?.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
}

export function SubjectExamsPage({ id }: { id: string }) {
  const { data: subject } = useSubjectDetail(id)
  const { data: allClassrooms = [] } = useClassrooms()
  const { data: exams = [], isLoading } = useExams()

  const subjectClassroomIds = useMemo(
    () => new Set(allClassrooms.filter((c) => c.subjectId === Number(id)).map((c) => c.id)),
    [allClassrooms, id],
  )
  const filtered = useMemo(
    () => exams.filter((e) => e.classroomIds.some((cId) => subjectClassroomIds.has(Number(cId)))),
    [exams, subjectClassroomIds],
  )
  if (isLoading) return <PageSkeleton />
  return (
    <div className="space-y-6">
      <PageHeader title={`Ujian — ${subject?.name ?? '...'}`} description={`${filtered.length} ujian`} />
      {filtered.length === 0
        ? <EmptyState icon={<GraduationCap className="h-12 w-12" />} text="Belum ada ujian untuk mata pelajaran ini" />
        : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <Link key={e.id} href={`/exams/${e.id}`}>
                <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
                  <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-[#0F172A]">{e.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {e.durationMinutes} menit · {e.questions.length} soal
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {formatDate(e.deadlineDate)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
}

export function SubjectAssignmentsPage({ id }: { id: string }) {
  const { data: subject } = useSubjectDetail(id)
  const { data: assignments = [], isLoading } = useAssignments()
  const filtered = useMemo(
    () => assignments.filter((a) => a.subjectId === Number(id)),
    [assignments, id],
  )
  if (isLoading) return <PageSkeleton />
  return (
    <div className="space-y-6">
      <PageHeader title={`Tugas — ${subject?.name ?? '...'}`} description={`${filtered.length} tugas`} />
      {filtered.length === 0
        ? <EmptyState icon={<LayoutList className="h-12 w-12" />} text="Belum ada tugas untuk mata pelajaran ini" />
        : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <Link key={a.id} href={`/assignments/${a.id}`}>
                <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
                  <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-[#0F172A]">{a.title}</p>
                      <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">{a.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {formatDate(a.dueDate)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#64748B]">
      <span className="opacity-40">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 bg-[#E2E8F0]" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg bg-[#E2E8F0]" />)}
      </div>
    </div>
  )
}