'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { School, Users, BookOpen, GraduationCap, FolderOpen } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { isPast } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { getClassroomsService } from '@/services/classroom-service'
import { getAssignmentsService } from '@/services/assignment-service'
import { getExamsService } from '@/services/exam-service'
import { getUsersService } from '@/services/user-service'
import { USER_ROLE } from '@/types/roles'

export function TeacherDashboard() {
  const { user } = useAuth()

  const { data: classrooms = [], isLoading: cLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: getClassroomsService,
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const { data: allStudents = [], isLoading: sLoading } = useQuery({
    queryKey: ['users', USER_ROLE.Student],
    queryFn: () => getUsersService(USER_ROLE.Student),
    enabled: !!user,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })

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

  const myClassrooms = useMemo(() =>
    user?.subjectId
      ? classrooms.filter((c) => c.subjectId === user.subjectId)
      : classrooms,
    [classrooms, user?.subjectId],
  )

  const myClassroomIds = useMemo(
    () => new Set(myClassrooms.map((c) => c.id)),
    [myClassrooms],
  )

  const myStudents = useMemo(() =>
    allStudents.filter((s) => s.classroomId != null && myClassroomIds.has(s.classroomId)),
    [allStudents, myClassroomIds],
  )

  const myAssignments = useMemo(() =>
    sortByNearestDateAsc(
      allAssignments.filter((a) =>
        a.classroomIds.some((id) => myClassroomIds.has(Number(id))),
      ),
      (a) => a.dueDate,
    ),
    [allAssignments, myClassroomIds],
  )

  const myExams = useMemo(() =>
    sortByNearestDateAsc(
      allExams.filter((e) =>
        e.classroomIds.some((id) => myClassroomIds.has(Number(id))),
      ),
      (e) => e.deadlineDate,
    ),
    [allExams, myClassroomIds],
  )

  const isLoading = cLoading || sLoading || aLoading || eLoading

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Selamat datang, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {user?.subject?.name ?? 'Pengajar'} · {user?.position ?? ''}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<School className="h-5 w-5 text-[#4B5CF0]" />}
          label="Kelas Saya"
          value={myClassrooms.length}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#22C55E]" />}
          label="Mahasiswa"
          value={myStudents.length}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-[#F59E0B]" />}
          label="Tugas Aktif"
          value={myAssignments.filter((a) => !isPast(a.dueDate)).length}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-[#4B5CF0]" />}
          label="Ujian Aktif"
          value={myExams.filter((e) => !isPast(e.deadlineDate)).length}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 mb-4">
          <button className="text-sm font-medium text-[#4B5CF0] border-b-2 border-[#4B5CF0] pb-2">
            Kelas ({myClassrooms.length})
          </button>
          <button className="text-sm font-medium text-[#64748B] pb-2">
            Mahasiswa ({myStudents.length})
          </button>
          <button className="text-sm font-medium text-[#64748B] pb-2">
            Tugas ({myAssignments.length})
          </button>
          <button className="text-sm font-medium text-[#64748B] pb-2">
            Ujian ({myExams.length})
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myClassrooms.length === 0 ? (
            <EmptyState text="Tidak ada kelas" />
          ) : (
            myClassrooms.map((c) => (
              <Link key={c.id} href={`/classrooms/${c.id}`}>
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm hover:border-[#4B5CF0] hover:shadow transition-all duration-200">
                  <p className="font-semibold text-[#0F172A]">{c.name}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">{c.subject?.name}</p>
                  <Badge className="mt-2 text-xs bg-[#EEF1FF] text-[#4B5CF0] border-0">
                    {c.semester?.name}
                  </Badge>
                </div>
              </Link>
            ))
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
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#64748B]">
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg bg-[#E2E8F0]" />)}
      </div>
    </div>
  )
}