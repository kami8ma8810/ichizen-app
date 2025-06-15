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
        
        // 善行メインカラー（緑茶系）
        good: {
          DEFAULT: '#4a5d23', // 抹茶色（コントラスト比4.5以上）
          50: '#f6f8f0',   // 若緑
          100: '#ebf1db',  // 薄緑
          200: '#d6e3b7',  // 萌黄色
          300: '#bdd188',  // 若草色
          400: '#a4bf5a',  // 若葉色
          500: '#7a9b3a',  // 緑茶色
          600: '#4a5d23',  // 抹茶色
          700: '#3a4a1c',  // 深緑
          800: '#2f3b17',  // 濃緑
          900: '#232d11',  // 深緑茶
        },
        
        // 朱色系（アクセント）
        vermillion: {
          50: '#fef7f2',   // 桜色
          100: '#fde9d9',  // 薄紅
          200: '#fad0b3',  // 桃色
          300: '#f6b087',  // 珊瑚色
          400: '#f08c5a',  // 橙色
          500: '#e8653a',  // 朱色
          600: '#d14d26',  // 紅色
          700: '#b03e20',  // 深紅
          800: '#8f321a',  // 茶赤
          900: '#742917',  // 焦げ茶
        },
        
        // 藍色系（セカンダリ）
        indigo: {
          50: '#f0f4f8',   // 白群
          100: '#dce7f0',  // 薄藍
          200: '#b8d0e0',  // 水色
          300: '#8fb5d0',  // 藍鼠
          400: '#6a9bc2',  // 薄藍
          500: '#4682b4',  // 藍色
          600: '#2d5aa0',  // 紺藍
          700: '#1e3a8a',  // 紺色
          800: '#1e2b6f',  // 深紺
          900: '#1a1f5c',  // 濃紺
        },
        
        // アクセシビリティ対応カラー（WCAG2.2準拠）
        accessible: {
          text: {
            primary: '#1a1d1a',     // コントラスト比 15.3:1
            secondary: '#4a5d23',   // コントラスト比 4.7:1
            muted: '#6b7280',       // コントラスト比 4.5:1
            inverse: '#ffffff',     // 白背景用
          },
          bg: {
            primary: '#ffffff',     // メイン背景
            secondary: '#fdfcfa',   // セカンダリ背景
            muted: '#f6f8f0',      // ミュート背景
          },
          border: {
            light: '#e4d2b8',      // 薄いボーダー
            medium: '#c19a6b',     // 標準ボーダー
            dark: '#8b5a3c',       // 濃いボーダー
          },
          focus: {
            ring: '#4682b4',       // フォーカスリング
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