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
      <div className="flex items-start gap-3 border-b border-[#E2E8F0] pb-3">
        <div className="w-0.5 h-5 rounded-full bg-[#4B5CF0] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
          {description && (
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}