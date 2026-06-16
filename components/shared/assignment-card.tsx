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
      <Card className={cn('hover:bg-muted/30 transition-colors', className)}>
        <CardContent className="py-3 px-4">
          <div className="flex items-start gap-3">
            <LayoutList className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {types.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                  </Badge>
                ))}
                <Badge
                  variant={overdue ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {formatDate(dueDate)}
                </Badge>
              </div>
            </div>
            {isSubmitted && (
              <Badge className="shrink-0 text-xs">
                {isLate ? 'Terlambat' : 'Dikumpulkan'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
