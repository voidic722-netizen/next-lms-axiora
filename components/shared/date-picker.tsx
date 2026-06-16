'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ── DatePicker ────────────────────────────────────────────────────────────────
interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] transition-all duration-200',
            !value && 'text-[#64748B]',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#64748B]" />
          {value ? format(value, 'dd MMMM yyyy', { locale: idLocale }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-[#E2E8F0] rounded-xl shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ── DateTimePicker ────────────────────────────────────────────────────────────
interface DateTimePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal & waktu',
  disabled = false,
  className,
}: DateTimePickerProps) {
  return (
    <input
      type="datetime-local"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        'flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] transition-all duration-200 outline-none',
        'placeholder:text-[#64748B]',
        'focus-visible:border-[#4B5CF0] focus-visible:ring-2 focus-visible:ring-[#4B5CF0]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    />
  )
}