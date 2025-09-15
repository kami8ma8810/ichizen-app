import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary: "bg-apple-blue text-white hover:bg-apple-blue-dark focus-visible:ring-apple-blue/20",
        secondary: "bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200 focus-visible:ring-apple-gray-500/20",
        ghost: "text-apple-blue border border-apple-blue/20 hover:bg-apple-blue/5 focus-visible:ring-apple-blue/20",
        danger: "bg-apple-red text-white hover:bg-apple-red-dark focus-visible:ring-apple-red/20",
        success: "bg-apple-green text-white hover:bg-apple-green-dark focus-visible:ring-apple-green/20",
        link: "text-apple-blue underline-offset-4 hover:underline",
      },
      size: {
        xs: "text-body-s px-3 py-1.5 rounded-apple-xs",
        sm: "text-body-m px-4 py-2 rounded-apple-sm",
        md: "text-body-l px-6 py-3 rounded-apple-button",
        lg: "text-title-s px-8 py-4 rounded-apple-button",
        xl: "text-title-m px-10 py-5 rounded-apple-button",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }