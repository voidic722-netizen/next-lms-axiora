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
    <CardContent className="py-3.5 px-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex items-center justify-center size-8 rounded-lg bg-[#EEF1FF] text-[#4B5CF0] shrink-0 mt-0.5">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#0F172A] truncate">{title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {examTypes.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
            <Badge className={cn('text-xs', statusBadge.className)}>
              {statusBadge.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#64748B]">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{durationMinutes} menit · {questionCount} soal · {formatDate(deadlineDate)}</span>
          </div>
        </div>
      </div>
    </CardContent>
  )

  const cardClass = cn(
    'group border border-[#E2E8F0] bg-white shadow-premium hover:border-[#4B5CF0]/40 hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200',
    onClick && 'cursor-pointer',
    className
  )

  if (onClick) {
    return (
      <Card className={cardClass} onClick={(e) => onClick(e)}>
        {content}
      </Card>
    )
  }

  return (
    <Link href={href ?? `/exams/${id}`}>
      <Card className={cardClass}>
        {content}
      </Card>
    </Link>
  )
}