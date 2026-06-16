'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, GraduationCap, CalendarDays, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatDay, isPast, isFuture } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { ASSIGNMENT_TYPE_LABELS } from '@/features/assignments/constants/assignment-type-labels'
import { getAssignmentsService } from '@/services/assignment-service'
import { getExamsService } from '@/services/exam-service'
import { getSchedulesService } from '@/services/schedule-service'
import { getMyAssignmentSubmissionService } from '@/services/assignment-submission-service'
import { getMyExamSubmissionService } from '@/services/exam-submission-service'
import type { Assignment } from '@/types/assignment'
import type { Exam } from '@/types/exam'
import type { Schedule } from '@/types/schedule'

export function StudentDashboard() {
  // FIX: user sekarang ada di queryKey, bukan dalam stale closure
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

  // Filter berdasarkan kelas mahasiswa
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

  // FIX N+1: submission status diambil dalam satu query gabungan
  // Dependency-nya adalah ID list — jika list berubah, query diulang.
  // TanStack Query men-cache hasilnya sehingga tidak refetch jika ID sama.
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Selamat datang, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {user?.classroom?.name ?? 'Belum terdaftar di kelas'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          label="Tugas" value={assignments.length} />
        <StatCard icon={<GraduationCap className="h-5 w-5 text-purple-500" />}
          label="Ujian" value={exams.length} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          label="Sudah Dikumpul"
          value={assignmentIds.filter((id) => submissionMap?.assignments[id]).length} />
        <StatCard icon={<CalendarDays className="h-5 w-5 text-orange-500" />}
          label="Jadwal" value={schedules.length} />
      </div>

      <Tabs defaultValue="assignments">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="assignments">Tugas ({assignments.length})</TabsTrigger>
          <TabsTrigger value="exams">Ujian ({exams.length})</TabsTrigger>
          <TabsTrigger value="schedules">Jadwal ({schedules.length})</TabsTrigger>
        </TabsList>

        {/* Assignments */}
        <TabsContent value="assignments" className="mt-4 space-y-3">
          {sortedAssignments.length === 0
            ? <EmptyState text="Tidak ada tugas" />
            : sortedAssignments.map((a) => {
                const submitted = !!submissionMap?.assignments[a.id]
                const overdue = isPast(a.dueDate) && !submitted
                return (
                  <Link key={a.id} href={`/assignments/${a.id}`}>
                    <Card className="hover:bg-muted/30 transition-colors">
                      <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{a.title}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {a.types.map((t) => (
                              <Badge key={t} variant="outline" className="text-xs">
                                {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                              </Badge>
                            ))}
                            <span className={`text-xs ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                              {formatDate(a.dueDate)}
                            </span>
                          </div>
                        </div>
                        {submitted
                          ? <Badge className="shrink-0">Dikumpulkan</Badge>
                          : <Badge variant={overdue ? 'destructive' : 'secondary'} className="shrink-0">
                              {overdue ? 'Terlambat' : 'Belum'}
                            </Badge>}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
        </TabsContent>

        {/* Exams */}
        <TabsContent value="exams" className="mt-4 space-y-3">
          {sortedExams.length === 0
            ? <EmptyState text="Tidak ada ujian" />
            : sortedExams.map((e) => {
                const submitted = !!submissionMap?.exams[e.id]
                const notYet = isFuture(e.availableDate)
                const expired = isPast(e.deadlineDate)
                return (
                  <Link key={e.id} href={submitted ? `/exams/${e.id}/submitted` : `/exams/${e.id}`}>
                    <Card className="hover:bg-muted/30 transition-colors">
                      <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{e.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {e.durationMinutes} menit · {e.questions.length} soal · {formatDate(e.deadlineDate)}
                          </p>
                        </div>
                        {submitted
                          ? <Badge className="shrink-0 bg-green-600">Selesai</Badge>
                          : <Badge variant={expired ? 'destructive' : notYet ? 'secondary' : 'default'} className="shrink-0">
                              {expired ? 'Berakhir' : notYet ? 'Belum Mulai' : 'Mulai'}
                            </Badge>}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
        </TabsContent>

        {/* Schedules */}
        <TabsContent value="schedules" className="mt-4 space-y-3">
          {sortedSchedules.length === 0
            ? <EmptyState text="Tidak ada jadwal" />
            : sortedSchedules.map((s) => (
                <Card key={s.id}>
                  <CardContent className="py-3 px-4 flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <p className="text-xs text-muted-foreground">{formatDay(s.date).split(',')[0]}</p>
                      <p className="text-xl font-bold leading-tight">{new Date(s.date).getDate()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.topic}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(s.date)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3 flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-center text-sm text-muted-foreground py-8">{text}</p>
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
      <Skeleton className="h-10 w-72" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
      </div>
    </div>
  )
}
