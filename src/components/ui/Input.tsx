import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  "aria-label"?: string
  "aria-describedby"?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, "aria-label": ariaLabel, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "input-zen",
          className
        )}
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }