'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, GraduationCap, CalendarDays, CheckCircle2, Clock, FolderOpen } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDay, isPast, isFuture } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { ASSIGNMENT_TYPE_LABELS } from '@/features/assignments/constants/assignment-type-labels'
import { getAssignmentsService } from '@/services/assignment-service'
import { getExamsService } from '@/services/exam-service'
import { getSchedulesService } from '@/services/schedule-service'
import { getMyAssignmentSubmissionService } from '@/services/assignment-submission-service'
import { getMyExamSubmissionService } from '@/services/exam-submission-service'

export function StudentDashboard() {
  const { user } = useAuth()
  const classroomId = user?.classroomId

  const { data: allAssignments = [], isLoading: aLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignmentsService,
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const { data: allExams = [], isLoading: eLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: getExamsService,
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const { data: allSchedules = [], isLoading: sLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedulesService,
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const assignments = useMemo(() =>
    classroomId
      ? allAssignments.filter((a) => a.classroomIds.map(Number).includes(classroomId))
      : [],
    [allAssignments, classroomId],
  )

  const exams = useMemo(() =>
    classroomId
      ? allExams.filter((e) => e.classroomIds.map(Number).includes(classroomId))
      : [],
    [allExams, classroomId],
  )

  const schedules = useMemo(() =>
    classroomId
      ? allSchedules.filter((s) => s.classroomId === classroomId)
      : [],
    [allSchedules, classroomId],
  )

  const assignmentIds = useMemo(() => assignments.map((a) => a.id), [assignments])
  const examIds = useMemo(() => exams.map((e) => e.id), [exams])

  const { data: submissionMap } = useQuery({
    queryKey: ['student-submission-map', assignmentIds, examIds],
    queryFn: async () => {
      const [aResults, eResults] = await Promise.all([
        Promise.all(
          assignmentIds.map((id) =>
            getMyAssignmentSubmissionService(id)
              .then((sub) => ({ id, sub }))
              .catch(() => ({ id, sub: null })),
          ),
        ),
        Promise.all(
          examIds.map((id) =>
            getMyExamSubmissionService(id)
              .then((sub) => ({ id, sub }))
              .catch(() => ({ id, sub: null })),
          ),
        ),
      ])
      return {
        assignments: Object.fromEntries(aResults.map(({ id, sub }) => [id, sub])),
        exams: Object.fromEntries(eResults.map(({ id, sub }) => [id, sub])),
      }
    },
    enabled: assignmentIds.length > 0 || examIds.length > 0,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const sortedAssignments = useMemo(
    () => sortByNearestDateAsc(assignments, (a) => a.dueDate),
    [assignments],
  )
  const sortedExams = useMemo(
    () => sortByNearestDateAsc(exams, (e) => e.deadlineDate),
    [exams],
  )
  const sortedSchedules = useMemo(
    () => sortByNearestDateAsc(schedules, (s) => s.date),
    [schedules],
  )

  const isLoading = aLoading || eLoading || sLoading

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Selamat datang, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {user?.classroom?.name ?? 'Belum terdaftar di kelas'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-[#4B5CF0]" />}
          label="Tugas"
          value={assignments.length}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-[#4B5CF0]" />}
          label="Ujian"
          value={exams.length}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-[#22C55E]" />}
          label="Sudah Dikumpul"
          value={assignmentIds.filter((id) => submissionMap?.assignments[id]).length}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-[#F59E0B]" />}
          label="Jadwal"
          value={schedules.length}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 mb-4">
          <button
            onClick={() => {}}
            className="text-sm font-medium text-[#4B5CF0] border-b-2 border-[#4B5CF0] pb-2"
          >
            Tugas ({assignments.length})
          </button>
          <button
            onClick={() => {}}
            className="text-sm font-medium text-[#64748B] pb-2"
          >
            Ujian ({exams.length})
          </button>
          <button
            onClick={() => {}}
            className="text-sm font-medium text-[#64748B] pb-2"
          >
            Jadwal ({schedules.length})
          </button>
        </div>

        <div className="space-y-3">
          {sortedAssignments.length === 0 ? (
            <EmptyState text="Tidak ada tugas" />
          ) : (
            sortedAssignments.map((a) => {
              const submitted = !!submissionMap?.assignments[a.id]
              const overdue = isPast(a.dueDate) && !submitted
              return (
                <Link key={a.id} href={`/assignments/${a.id}`}>
                  <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm hover:border-[#4B5CF0] hover:shadow transition-all duration-200">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-[#0F172A] truncate">{a.title}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {a.types.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs bg-[#EEF1FF] text-[#4B5CF0] border-[#EEF1FF]">
                              {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                            </Badge>
                          ))}
                          <span className={`text-xs ${overdue ? 'text-[#EF4444] font-medium' : 'text-[#64748B]'}`}>
                            {formatDate(a.dueDate)}
                          </span>
                        </div>
                      </div>
                      {submitted ? (
                        <Badge className="shrink-0 bg-[#22C55E] text-white border-0">Dikumpulkan</Badge>
                      ) : (
                        <Badge className={`shrink-0 ${overdue ? 'bg-[#EF4444] text-white' : 'bg-[#F1F5F9] text-[#64748B]'} border-0`}>
                          {overdue ? 'Terlambat' : 'Belum'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF1FF]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-[#0F172A]">{value}</p>
        <p className="text-xs text-[#64748B]">{label}</p>
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#64748B]">
      <FolderOpen className="h-8 w-8 mb-2" strokeWidth={1.5} />
      <p className="text-sm">{text}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <Skeleton className="h-12 w-64 bg-[#E2E8F0]" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg bg-[#E2E8F0]" />)}
      </div>
      <Skeleton className="h-10 w-72 bg-[#E2E8F0]" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg bg-[#E2E8F0]" />)}
      </div>
    </div>
  )
}