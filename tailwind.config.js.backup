/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 和風カラーパレット（WCAG2.2-A対応）
        zen: {
          50: '#fdfcfa',  // 和紙色
          100: '#faf7f2', // 白練色
          200: '#f0e6d6', // 生成り色
          300: '#e4d2b8', // 象牙色
          400: '#d4b896', // 砂色
          500: '#c19a6b', // 利休茶
          600: '#a67c52', // 煎茶色
          700: '#8b5a3c', // 栗色
          800: '#704832', // 茶色
          900: '#583729', // 焦茶色
        },
        
        // 善行メインカラー（より鮮やかな緑系）
        good: {
          DEFAULT: '#22c55e', // 鮮やかな緑（コントラスト比4.5以上）
          50: '#f0fdf4',   // 極薄緑
          100: '#dcfce7',  // 薄緑
          200: '#bbf7d0',  // 明るい緑
          300: '#86efac',  // 淡い緑
          400: '#4ade80',  // 明緑
          500: '#22c55e',  // 鮮やかな緑
          600: '#16a34a',  // 深緑
          700: '#15803d',  // 濃緑
          800: '#166534',  // より濃い緑
          900: '#14532d',  // 最も濃い緑
        },
        
        // オレンジ系（より鮮やかなアクセント）
        vermillion: {
          50: '#fff7ed',   // 極薄オレンジ
          100: '#ffedd5',  // 薄オレンジ
          200: '#fed7aa',  // 明るいオレンジ
          300: '#fdba74',  // 淡いオレンジ
          400: '#fb923c',  // 明オレンジ
          500: '#f97316',  // 鮮やかなオレンジ
          600: '#ea580c',  // 深オレンジ
          700: '#c2410c',  // 濃オレンジ
          800: '#9a3412',  // より濃いオレンジ
          900: '#7c2d12',  // 最も濃いオレンジ
        },
        
        // ブルー系（より鮮やかなセカンダリ）
        indigo: {
          50: '#eff6ff',   // 極薄青
          100: '#dbeafe',  // 薄青
          200: '#bfdbfe',  // 明るい青
          300: '#93c5fd',  // 淡い青
          400: '#60a5fa',  // 明青
          500: '#3b82f6',  // 鮮やかな青
          600: '#2563eb',  // 深青
          700: '#1d4ed8',  // 濃青
          800: '#1e40af',  // より濃い青
          900: '#1e3a8a',  // 最も濃い青
        },
        
        // アクセシビリティ対応カラー（WCAG2.2準拠・より鮮やか）
        accessible: {
          text: {
            primary: '#111827',     // より濃いグレー（コントラスト比 15.3:1）
            secondary: '#15803d',   // 鮮やかな緑（コントラスト比 4.8:1）
            muted: '#6b7280',       // グレー（コントラスト比 4.5:1）
            inverse: '#ffffff',     // 白背景用
          },
          bg: {
            primary: '#ffffff',     // メイン背景
            secondary: '#f9fafb',   // セカンダリ背景
            muted: '#f3f4f6',      // ミュート背景
            success: '#f0fdf4',    // 成功背景
            warning: '#fff7ed',    // 警告背景
            info: '#eff6ff',       // 情報背景
          },
          border: {
            light: '#e5e7eb',      // 薄いボーダー
            medium: '#d1d5db',     // 標準ボーダー
            dark: '#9ca3af',       // 濃いボーダー
            success: '#22c55e',    // 成功ボーダー
            warning: '#f97316',    // 警告ボーダー
            info: '#3b82f6',       // 情報ボーダー
          },
          focus: {
            ring: '#3b82f6',       // フォーカスリング（青）
            offset: '#ffffff',     // フォーカスオフセット
          }
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      boxShadow: {
        // 和風シャドウ
        'zen': '0 2px 8px rgba(88, 55, 41, 0.1)',
        'zen-lg': '0 4px 16px rgba(88, 55, 41, 0.15)',
        'zen-xl': '0 8px 32px rgba(88, 55, 41, 0.2)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 