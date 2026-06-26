'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { School, Users, BookOpen, GraduationCap, ArrowRight, UserCircle, BookText } from 'lucide-react'
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
import { cn } from '@/lib/utils'

export function TeacherDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'kelas' | 'tugas' | 'ujian'>('kelas')

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
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-8 sm:p-10 text-white shadow-premium">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-72 w-72 rounded-full bg-[#4B5CF0]/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-0 mb-4 tracking-wide font-medium backdrop-blur-sm">
              Dashboard Pengajar
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Selamat datang, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-[#94A3B8] text-sm sm:text-base max-w-lg leading-relaxed">
              Pantau perkembangan kelas, tugas, dan ujian mahasiswa Anda dengan mudah di satu tempat.
            </p>
          </div>
          
          {user?.subject && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:min-w-[280px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#4B5CF0] to-[#3D4DE0] shadow-inner">
                <BookText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-0.5">Mata Pelajaran</p>
                <p className="text-lg font-bold text-white">{user.subject.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={<School className="h-5 w-5 text-[#4B5CF0]" />}
          label="Kelas Saya"
          value={myClassrooms.length}
          trend="Semester aktif"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#22C55E]" />}
          label="Mahasiswa"
          value={myStudents.length}
          trend="Total dari semua kelas"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-[#F59E0B]" />}
          label="Tugas Aktif"
          value={myAssignments.filter((a) => !isPast(a.dueDate)).length}
          trend={myAssignments.length + " total tugas"}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-[#4B5CF0]" />}
          label="Ujian Aktif"
          value={myExams.filter((e) => !isPast(e.deadlineDate)).length}
          trend={myExams.length + " total ujian"}
        />
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Modern Tabs */}
        <div className="border-b border-[#E2E8F0] p-2 sm:px-6 bg-[#F8FAFC]">
          <div className="flex p-1 bg-[#F1F5F9] rounded-xl w-fit">
            <TabButton 
              active={activeTab === 'kelas'} 
              onClick={() => setActiveTab('kelas')}
              count={myClassrooms.length}
            >
              Kelas
            </TabButton>
            <TabButton 
              active={activeTab === 'tugas'} 
              onClick={() => setActiveTab('tugas')}
              count={myAssignments.length}
            >
              Tugas
            </TabButton>
            <TabButton 
              active={activeTab === 'ujian'} 
              onClick={() => setActiveTab('ujian')}
              count={myExams.length}
            >
              Ujian
            </TabButton>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white min-h-[400px]">
          {activeTab === 'kelas' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myClassrooms.length === 0 ? (
                <EmptyState icon={<School className="h-10 w-10" />} text="Belum ada kelas yang diampu" />
              ) : (
                myClassrooms.map((c) => {
                  const studentCount = allStudents.filter(s => s.classroomId === c.id).length
                  
                  return (
                    <Link key={c.id} href={`/classrooms/${c.id}`} className="group block h-full">
                      <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAFC] group-hover:bg-[#EEF1FF] group-hover:text-[#4B5CF0] transition-colors duration-300">
                            <School className="h-6 w-6 text-[#94A3B8] group-hover:text-[#4B5CF0] transition-colors" />
                          </div>
                          <Badge className="bg-[#F1F5F9] text-[#64748B] hover:bg-[#F1F5F9] border-0 text-[10px] font-bold uppercase tracking-wider">
                            {c.semester?.name || 'Semester'}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg text-[#0F172A] mb-1 group-hover:text-[#4B5CF0] transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-sm text-[#64748B] mb-5">{c.subject?.name || 'Mata Pelajaran'}</p>
                        
                        <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[#4B5CF0]">
                            <UserCircle className="h-4 w-4" />
                            {studentCount} Mahasiswa
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

          {activeTab === 'tugas' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myAssignments.length === 0 ? (
                <EmptyState icon={<BookOpen className="h-10 w-10" />} text="Belum ada tugas yang dibuat" />
              ) : (
                myAssignments.map((a) => (
                  <Link key={a.id} href={`/assignments/${a.id}`} className="group block h-full">
                    <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-300 relative overflow-hidden">
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-[#EEF1FF] text-[#4B5CF0] border-0 shrink-0">
                            {a.classroomIds.length} Kelas
                          </Badge>
                          <Badge className={cn("shrink-0 border-0 text-xs", isPast(a.dueDate) ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#22C55E]/10 text-[#166534]')}>
                            {isPast(a.dueDate) ? 'Berakhir' : 'Aktif'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base text-[#0F172A] line-clamp-2 mb-2 group-hover:text-[#4B5CF0] transition-colors duration-200">
                          {a.title}
                        </h3>
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-[#F1F5F9] flex items-center justify-between">
                        <span className="text-xs text-[#64748B] font-medium">Lihat detail</span>
                        <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#4B5CF0] group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'ujian' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myExams.length === 0 ? (
                <EmptyState icon={<GraduationCap className="h-10 w-10" />} text="Belum ada ujian yang dibuat" />
              ) : (
                myExams.map((e) => (
                  <Link key={e.id} href={`/exams/${e.id}`} className="group block h-full">
                    <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-300 relative overflow-hidden">
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-[#EEF1FF] text-[#4B5CF0] border-0 shrink-0">
                            {e.classroomIds.length} Kelas
                          </Badge>
                          <Badge className={cn("shrink-0 border-0 text-xs", isPast(e.deadlineDate) ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#22C55E]/10 text-[#166534]')}>
                            {isPast(e.deadlineDate) ? 'Berakhir' : 'Aktif'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base text-[#0F172A] line-clamp-2 mb-2 group-hover:text-[#4B5CF0] transition-colors duration-200">
                          {e.title}
                        </h3>
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-[#F1F5F9] flex items-center justify-between">
                        <span className="text-xs text-[#64748B] font-medium">Lihat detail</span>
                        <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#4B5CF0] group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
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