import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-[0.97] outline-none focus-visible:ring-[3px] focus-visible:ring-[#4B5CF0]/15 disabled:pointer-events-none disabled:opacity-50 disabled:scale-100 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#4B5CF0] text-white shadow-sm hover:bg-[#3D4DE0] active:bg-[#3545D0]",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-[#DC2626] focus-visible:ring-[#EF4444]/15",
        outline:
          "border border-[#E2E8F0] bg-white shadow-sm text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
        secondary:
          "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]",
        ghost:
          "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
        link: "text-[#4B5CF0] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
