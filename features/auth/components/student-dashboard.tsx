'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, GraduationCap, CalendarDays, CheckCircle2, ArrowRight, Clock, BookText } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, isPast } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { getAssignmentsService } from '@/services/assignment-service'
import { getExamsService } from '@/services/exam-service'
import { getSchedulesService } from '@/services/schedule-service'
import { getMyAssignmentSubmissionService } from '@/services/assignment-submission-service'
import { getMyExamSubmissionService } from '@/services/exam-submission-service'
import { cn } from '@/lib/utils'

export function StudentDashboard() {
  const { user } = useAuth()
  const classroomId = user?.classroomId
  const [activeTab, setActiveTab] = useState<'tugas' | 'ujian' | 'jadwal'>('tugas')

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

  const isLoading = aLoading || eLoading || sLoading

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4B5CF0] to-[#3D4DE0] p-8 sm:p-10 text-white shadow-premium">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 mb-4 tracking-wide font-medium backdrop-blur-sm">
            Student Dashboard
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Selamat datang, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[#EEF1FF] text-sm sm:text-base max-w-lg leading-relaxed">
            {user?.classroom?.name
              ? `Kamu saat ini terdaftar di kelas ${user.classroom.name}. Tetap semangat dan pantau terus tugas serta ujianmu!`
              : 'Kamu belum terdaftar di kelas manapun. Hubungi admin untuk informasi lebih lanjut.'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-[#4B5CF0]" />}
          label="Total Tugas"
          value={assignments.length}
          trend={assignments.filter(a => !isPast(a.dueDate)).length + ' aktif'}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-[#4B5CF0]" />}
          label="Total Ujian"
          value={exams.length}
          trend={exams.filter(e => !isPast(e.deadlineDate)).length + ' aktif'}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-[#22C55E]" />}
          label="Diselesaikan"
          value={
            (assignmentIds.filter((id) => submissionMap?.assignments[id]).length) +
            (examIds.filter((id) => submissionMap?.exams[id]).length)
          }
          trend="Tugas & Ujian"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-[#F59E0B]" />}
          label="Jadwal Kelas"
          value={schedules.length}
          trend="Minggu ini"
        />
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Modern Tabs */}
        <div className="border-b border-[#E2E8F0] p-2 sm:px-6 bg-[#F8FAFC]">
          <div className="flex p-1 bg-[#F1F5F9] rounded-xl w-fit">
            <TabButton 
              active={activeTab === 'tugas'} 
              onClick={() => setActiveTab('tugas')}
              count={assignments.length}
            >
              Tugas
            </TabButton>
            <TabButton 
              active={activeTab === 'ujian'} 
              onClick={() => setActiveTab('ujian')}
              count={exams.length}
            >
              Ujian
            </TabButton>
            <TabButton 
              active={activeTab === 'jadwal'} 
              onClick={() => setActiveTab('jadwal')}
              count={schedules.length}
            >
              Jadwal
            </TabButton>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white min-h-[400px]">
          {activeTab === 'tugas' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAssignments.length === 0 ? (
                <EmptyState icon={<BookOpen className="h-10 w-10" />} text="Tidak ada tugas saat ini" />
              ) : (
                sortedAssignments.map((a) => {
                  const submitted = !!submissionMap?.assignments[a.id]
                  const overdue = isPast(a.dueDate) && !submitted
                  return (
                    <Link key={a.id} href={`/assignments/${a.id}`} className="group block h-full">
                      <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-300 relative overflow-hidden">
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300",
                          submitted ? "bg-[#22C55E]" : overdue ? "bg-[#EF4444]" : "bg-[#4B5CF0]"
                        )} />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-[#EEF1FF] text-[#4B5CF0] border-0 shrink-0">
                              {'Tugas'}
                            </Badge>
                            {submitted ? (
                              <Badge className="shrink-0 bg-[#22C55E]/10 text-[#166534] border-0 text-xs">Selesai</Badge>
                            ) : (
                              <Badge className={cn("shrink-0 border-0 text-xs", overdue ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#F8FAFC] text-[#64748B]')}>
                                {overdue ? 'Terlambat' : 'Belum'}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-base text-[#0F172A] line-clamp-2 mb-2 group-hover:text-[#4B5CF0] transition-colors duration-200">
                            {a.title}
                          </h3>
                        </div>
                        
                        <div className="pt-4 mt-auto border-t border-[#F1F5F9] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <Clock className={cn("h-3.5 w-3.5", overdue && !submitted && "text-[#EF4444]")} />
                            <span className={cn(overdue && !submitted && "text-[#EF4444] font-medium")}>
                              {formatDate(a.dueDate)}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#4B5CF0] group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'ujian' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedExams.length === 0 ? (
                <EmptyState icon={<GraduationCap className="h-10 w-10" />} text="Tidak ada ujian saat ini" />
              ) : (
                sortedExams.map((e) => {
                  const submitted = !!submissionMap?.exams[e.id]
                  const overdue = isPast(e.deadlineDate) && !submitted
                  return (
                    <Link key={e.id} href={`/exams/${e.id}`} className="group block h-full">
                      <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-300 relative overflow-hidden">
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300",
                          submitted ? "bg-[#22C55E]" : overdue ? "bg-[#EF4444]" : "bg-[#4B5CF0]"
                        )} />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-[#EEF1FF] text-[#4B5CF0] border-0 shrink-0">
                              {'Ujian'}
                            </Badge>
                            {submitted ? (
                              <Badge className="shrink-0 bg-[#22C55E]/10 text-[#166534] border-0 text-xs">Selesai</Badge>
                            ) : (
                              <Badge className={cn("shrink-0 border-0 text-xs", overdue ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#F8FAFC] text-[#64748B]')}>
                                {overdue ? 'Terlambat' : 'Belum'}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-base text-[#0F172A] line-clamp-2 mb-2 group-hover:text-[#4B5CF0] transition-colors duration-200">
                            {e.title}
                          </h3>
                        </div>
                        
                        <div className="pt-4 mt-auto border-t border-[#F1F5F9] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <Clock className={cn("h-3.5 w-3.5", overdue && !submitted && "text-[#EF4444]")} />
                            <span className={cn(overdue && !submitted && "text-[#EF4444] font-medium")}>
                              {formatDate(e.deadlineDate)}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#4B5CF0] group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'jadwal' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.length === 0 ? (
                <EmptyState icon={<CalendarDays className="h-10 w-10" />} text="Tidak ada jadwal saat ini" />
              ) : (
                schedules.map((s) => (
                  <div key={s.id} className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#4B5CF0]">
                        <BookText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F172A]">{s.topic || 'Jadwal'}</h3>
                        <p className="text-sm text-[#64748B]">{s.classroom?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9] text-sm text-[#64748B]">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(s.date)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: number; trend: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-premium hover:border-[#CBD5E1] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748B] mb-1">{label}</p>
          <p className="text-3xl font-bold tabular-nums text-[#0F172A] tracking-tight">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAFC] group-hover:bg-[#EEF1FF] transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-[#94A3B8]">
        {trend}
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick, count }: { children: React.ReactNode; active: boolean; onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
        active 
          ? "bg-white text-[#4B5CF0] shadow-sm ring-1 ring-black/5" 
          : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
      )}
    >
      {children}
      <span className={cn(
        "px-1.5 py-0.5 rounded-md text-[10px] leading-none transition-colors duration-200",
        active ? "bg-[#EEF1FF]" : "bg-[#E2E8F0] text-[#64748B]"
      )}>
        {count}
      </span>
    </button>
  )
}

function EmptyState({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Kososng</h3>
      <p className="text-sm text-[#64748B] max-w-sm mx-auto">{text}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto">
      <Skeleton className="h-48 rounded-2xl bg-[#E2E8F0]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-[#E2E8F0]" />)}
      </div>
      <Skeleton className="h-[500px] rounded-2xl bg-[#E2E8F0]" />
    </div>
  )
}