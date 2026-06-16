'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { School, Users, BookOpen, GraduationCap } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, isPast } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { ASSIGNMENT_TYPE_LABELS } from '@/features/assignments/constants/assignment-type-labels'
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

  // Filter kelas berdasarkan mata pelajaran pengajar (subjectId)
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

  // Mahasiswa yang berada di kelas pengajar
  const myStudents = useMemo(() =>
    allStudents.filter((s) => s.classroomId != null && myClassroomIds.has(s.classroomId)),
    [allStudents, myClassroomIds],
  )

  // Tugas yang ditujukan ke kelas pengajar
  const myAssignments = useMemo(() =>
    sortByNearestDateAsc(
      allAssignments.filter((a) =>
        a.classroomIds.some((id) => myClassroomIds.has(Number(id))),
      ),
      (a) => a.dueDate,
    ),
    [allAssignments, myClassroomIds],
  )

  // Ujian yang ditujukan ke kelas pengajar
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Selamat datang, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {user?.subject?.name ?? 'Pengajar'} · {user?.position ?? ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<School className="h-5 w-5 text-blue-500" />}
          label="Kelas Saya" value={myClassrooms.length} />
        <StatCard icon={<Users className="h-5 w-5 text-green-500" />}
          label="Mahasiswa" value={myStudents.length} />
        <StatCard icon={<BookOpen className="h-5 w-5 text-orange-500" />}
          label="Tugas Aktif" value={myAssignments.filter((a) => !isPast(a.dueDate)).length} />
        <StatCard icon={<GraduationCap className="h-5 w-5 text-purple-500" />}
          label="Ujian Aktif" value={myExams.filter((e) => !isPast(e.deadlineDate)).length} />
      </div>

      <Tabs defaultValue="classrooms">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="classrooms">Kelas ({myClassrooms.length})</TabsTrigger>
          <TabsTrigger value="students">Mahasiswa ({myStudents.length})</TabsTrigger>
          <TabsTrigger value="assignments">Tugas ({myAssignments.length})</TabsTrigger>
          <TabsTrigger value="exams">Ujian ({myExams.length})</TabsTrigger>
        </TabsList>

        {/* Kelas */}
        <TabsContent value="classrooms" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myClassrooms.length === 0
            ? <p className="col-span-full text-center text-sm text-muted-foreground py-8">Tidak ada kelas</p>
            : myClassrooms.map((c) => (
                <Link key={c.id} href={`/classrooms/${c.id}`}>
                  <Card className="hover:bg-muted/30 transition-colors h-full">
                    <CardContent className="pt-4">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{c.subject?.name}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{c.semester?.name}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </TabsContent>

        {/* Mahasiswa */}
        <TabsContent value="students" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myStudents.length === 0
            ? <p className="col-span-full text-center text-sm text-muted-foreground py-8">Tidak ada mahasiswa</p>
            : myStudents.map((s) => (
                <Card key={s.id}>
                  <CardContent className="pt-4 flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm">{s.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.nim ?? s.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </TabsContent>

        {/* Tugas */}
        <TabsContent value="assignments" className="mt-4 space-y-3">
          {myAssignments.length === 0
            ? <p className="text-center text-sm text-muted-foreground py-8">Tidak ada tugas</p>
            : myAssignments.map((a) => (
                <Link key={a.id} href={`/assignments/${a.id}`}>
                  <Card className="hover:bg-muted/30 transition-colors">
                    <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{a.title}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {a.types.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant={isPast(a.dueDate) ? 'destructive' : 'secondary'} className="shrink-0 text-xs">
                        {formatDate(a.dueDate)}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </TabsContent>

        {/* Ujian */}
        <TabsContent value="exams" className="mt-4 space-y-3">
          {myExams.length === 0
            ? <p className="text-center text-sm text-muted-foreground py-8">Tidak ada ujian</p>
            : myExams.map((e) => (
                <Link key={e.id} href={`/exams/${e.id}/submissions`}>
                  <Card className="hover:bg-muted/30 transition-colors">
                    <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {e.durationMinutes} menit · {e.questions.length} soal
                        </p>
                      </div>
                      <Badge variant={isPast(e.deadlineDate) ? 'destructive' : 'default'} className="shrink-0 text-xs">
                        {formatDate(e.deadlineDate)}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
    </div>
  )
}
