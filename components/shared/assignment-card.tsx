import Link from 'next/link'
import { LayoutList } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, isPast } from '@/lib/format-date'
import { ASSIGNMENT_TYPE_LABELS } from '@/features/assignments/constants/assignment-type-labels'
import { cn } from '@/lib/utils'

interface AssignmentCardProps {
  id: number
  title: string
  description: string
  types: string[]
  dueDate: string
  isSubmitted?: boolean
  isLate?: boolean
  className?: string
}

export function AssignmentCard({
  id,
  title,
  description,
  types,
  dueDate,
  isSubmitted,
  isLate,
  className,
}: AssignmentCardProps) {
  const overdue = isPast(dueDate) && !isSubmitted

  return (
    <Link href={`/assignments/${id}`}>
      <Card className={cn(
        'border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200',
        className
      )}>
        <CardContent className="py-3 px-4">
          <div className="flex items-start gap-3">
            <LayoutList className="h-4 w-4 text-[#4B5CF0] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#0F172A] truncate">{title}</p>
              <p className="text-xs text-[#64748B] truncate mt-0.5">{description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {types.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                  </Badge>
                ))}
                <Badge
                  variant={overdue ? 'destructive' : 'ghost'}
                  className="text-xs"
                >
                  {formatDate(dueDate)}
                </Badge>
              </div>
            </div>
            {isSubmitted && (
              <Badge className={cn(
                'shrink-0 text-xs border-0',
                isLate ? 'bg-[#EF4444] text-white' : 'bg-[#22C55E] text-white'
              )}>
                {isLate ? 'Terlambat' : 'Dikumpulkan'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}