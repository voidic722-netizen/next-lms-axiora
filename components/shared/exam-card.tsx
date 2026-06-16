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
    ? { label: 'Selesai', variant: 'default' as const }
    : expired
      ? { label: 'Berakhir', variant: 'destructive' as const }
      : notYet
        ? { label: 'Belum Mulai', variant: 'secondary' as const }
        : { label: 'Aktif', variant: 'default' as const }

  const content = (
    <CardContent className="py-3 px-4">
      <div className="flex items-start gap-3">
        <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{title}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {examTypes.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
            <Badge variant={statusBadge.variant} className="text-xs">
              {statusBadge.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
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
        className={cn('cursor-pointer hover:bg-muted/30 transition-colors', className)}
        onClick={(e) => onClick(e)}
      >
        {content}
      </Card>
    )
  }

  return (
    <Link href={href ?? `/exams/${id}`}>
      <Card className={cn('hover:bg-muted/30 transition-colors', className)}>
        {content}
      </Card>
    </Link>
  )
}
