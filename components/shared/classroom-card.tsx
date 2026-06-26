import Link from 'next/link'
import { School } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// ── ClassroomCard ─────────────────────────────────────────────────────────────
interface ClassroomCardProps {
  id: number
  name: string
  subjectName?: string
  semesterName?: string
  studentCount?: number
  className?: string
}

export function ClassroomCard({
  id,
  name,
  subjectName,
  semesterName,
  studentCount,
  className,
}: ClassroomCardProps) {
  return (
    <Link href={`/classrooms/${id}`}>
      <Card
        className={cn(
          'group border border-[#E2E8F0] bg-white shadow-premium hover:border-[#4B5CF0]/40 hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200 h-full',
          className
        )}
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex items-center justify-center size-9 rounded-lg bg-[#EEF1FF] text-[#4B5CF0] shrink-0">
              <School className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0F172A] truncate">{name}</p>
              {subjectName && (
                <p className="text-sm text-[#64748B] truncate mt-0.5">{subjectName}</p>
              )}
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {semesterName && (
                  <Badge variant="secondary" className="text-xs">{semesterName}</Badge>
                )}
                {studentCount !== undefined && (
                  <Badge variant="secondary" className="text-xs">{studentCount} mahasiswa</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── StudentCard ──────────────────────────────────────────────────────────────
interface StudentCardProps {
  id: number
  name: string
  nim?: string | null
  email: string
  image?: string | null
  classroomName?: string
  className?: string
}

export function StudentCard({
  name,
  nim,
  email,
  image,
  classroomName,
  className,
}: StudentCardProps) {
  return (
    <Card
      className={cn(
        'border border-[#E2E8F0] bg-white shadow-premium hover:border-[#4B5CF0]/40 hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      <CardContent className="pt-4 flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback className="bg-[#EEF1FF] text-[#4B5CF0] font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-sm text-[#0F172A] truncate">{name}</p>
          <p className="text-xs text-[#64748B] truncate">{nim ?? email}</p>
          {classroomName && (
            <p className="text-xs text-[#64748B] truncate">{classroomName}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── TeacherCard ──────────────────────────────────────────────────────────────
interface TeacherCardProps {
  id: number
  name: string
  nidn?: string | null
  email: string
  position?: string | null
  image?: string | null
  departmentName?: string
  className?: string
}

export function TeacherCard({
  name,
  nidn,
  email,
  position,
  image,
  departmentName,
  className,
}: TeacherCardProps) {
  return (
    <Card
      className={cn(
        'border border-[#E2E8F0] bg-white shadow-premium hover:border-[#4B5CF0]/40 hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      <CardContent className="pt-4 flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback className="bg-[#EEF1FF] text-[#4B5CF0] font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-sm text-[#0F172A] truncate">{name}</p>
          <p className="text-xs text-[#64748B] truncate">{nidn ?? email}</p>
          {position && (
            <Badge variant="secondary" className="text-xs mt-1.5">{position}</Badge>
          )}
          {departmentName && (
            <p className="text-xs text-[#64748B] truncate mt-0.5">{departmentName}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}