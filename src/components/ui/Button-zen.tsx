import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // ベーススタイル（WCAG2.2-A準拠）
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:transition-all",
  {
    variants: {
      variant: {
        // 抹茶色ボタン（メイン）
        default: "bg-good-600 text-white hover:bg-good-700 focus:bg-good-700 shadow-zen hover:shadow-zen-lg active:scale-95",
        
        // 朱色ボタン（アクセント）
        vermillion: "bg-vermillion-500 text-white hover:bg-vermillion-600 focus:bg-vermillion-600 shadow-zen hover:shadow-zen-lg active:scale-95",
        
        // 藍色ボタン（セカンダリ）
        indigo: "bg-indigo-500 text-white hover:bg-indigo-600 focus:bg-indigo-600 shadow-zen hover:shadow-zen-lg active:scale-95",
        
        // アウトラインボタン
        outline: "border-2 border-zen-500 bg-transparent text-zen-900 hover:bg-zen-100 focus:bg-zen-100 active:scale-95",
        
        // セカンダリボタン
        secondary: "bg-zen-200 text-zen-900 hover:bg-zen-300 focus:bg-zen-300 shadow-zen hover:shadow-zen-lg active:scale-95",
        
        // ゴーストボタン
        ghost: "hover:bg-zen-100 focus:bg-zen-100 text-zen-900 active:scale-95",
        
        // リンクボタン
        link: "text-indigo-600 underline-offset-4 hover:underline focus:underline decoration-2 active:scale-95",
        
        // 危険ボタン
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 shadow-zen hover:shadow-zen-lg active:scale-95"
      },
      size: {
        // 標準サイズ（44px以上でWCAG2.2準拠）
        default: "h-11 px-6 py-3",
        
        // 小サイズ（ギリギリ44px）
        sm: "h-11 px-4 py-3 text-sm",
        
        // 大サイズ
        lg: "h-14 px-8 py-4 text-base",
        
        // アイコンボタン（正方形、44px以上）
        icon: "h-11 w-11 p-0",
        
        // アイコンボタン大
        "icon-lg": "h-14 w-14 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, "aria-label": ariaLabel, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // アクセシビリティ警告
    if (React.isValidElement(children) && !ariaLabel && !props['aria-describedby'] && !children.props?.children) {
      console.warn('Button: アイコンのみのボタンには aria-label または aria-describedby を指定してください')
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// アクセシブルなアイコンボタンコンポーネント
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
  label: string // 必須のラベル
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = "icon", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        aria-label={label}
        {...props}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

export { Button, IconButton, buttonVariants }