import Link from 'next/link'
import { GraduationCap, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, isFuture, isPast } from '@/lib/format-date'
import { cn } from '@/lib/utils'

interface ExamCardProps {
  id: number
  title: string
  examTypes: string[]
  availableDate: string
  deadlineDate: string
  durationMinutes: number
  questionCount: number
  isSubmitted?: boolean
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export function ExamCard({
  id,
  title,
  examTypes,
  availableDate,
  deadlineDate,
  durationMinutes,
  questionCount,
  isSubmitted,
  href,
  onClick,
  className,
}: ExamCardProps) {
  const notYet = isFuture(availableDate)
  const expired = isPast(deadlineDate)

  const statusBadge = isSubmitted
    ? { label: 'Selesai', className: 'bg-[#22C55E] text-white border-0' }
    : expired
      ? { label: 'Berakhir', className: 'bg-[#EF4444] text-white border-0' }
      : notYet
        ? { label: 'Belum Mulai', className: 'bg-[#EEF1FF] text-[#4B5CF0] border-0' }
        : { label: 'Aktif', className: 'bg-[#4B5CF0] text-white border-0' }

  const content = (
    <CardContent className="py-3 px-4">
      <div className="flex items-start gap-3">
        <GraduationCap className="h-4 w-4 text-[#4B5CF0] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#0F172A] truncate">{title}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {examTypes.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
            <Badge className={cn('text-xs', statusBadge.className)}>
              {statusBadge.label}
            </Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {durationMinutes} menit · {questionCount} soal · {formatDate(deadlineDate)}
          </p>
        </div>
      </div>
    </CardContent>
  )

  if (onClick) {
    return (
      <Card
        className={cn(
          'cursor-pointer border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200',
          className
        )}
        onClick={(e) => onClick(e)}
      >
        {content}
      </Card>
    )
  }

  return (
    <Link href={href ?? `/exams/${id}`}>
      <Card
        className={cn(
          'border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200',
          className
        )}
      >
        {content}
      </Card>
    </Link>
  )
}