import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] transition-all duration-200 outline-none",
        "placeholder:text-[#64748B]",
        "selection:bg-[#4B5CF0] selection:text-white",
        "focus-visible:border-[#4B5CF0] focus-visible:ring-2 focus-visible:ring-[#4B5CF0]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#EF4444] aria-invalid:ring-[#EF4444]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }