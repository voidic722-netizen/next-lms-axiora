import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="border-b border-[#E2E8F0] pb-2">
        <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
        {description && (
          <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}