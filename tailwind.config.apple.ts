import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'Hiragino Sans',
          'Hiragino Kaku Gothic ProN',
          'Yu Gothic',
          'Meiryo',
          'sans-serif'
        ],
      },
      colors: {
        // Apple-inspired colors
        'apple': {
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': {
            50: '#FBFBFD',
            100: '#F5F5F7',
            200: '#E8E8ED',
            300: '#D2D2D7',
            400: '#ADADB8',
            500: '#86868B',
            600: '#6E6E73',
            700: '#48484A',
            800: '#2C2C2E',
            900: '#1C1C1E',
          },
          'blue': {
            light: '#0077ED',
            DEFAULT: '#0071E3',
            dark: '#0051D5',
          },
          'green': {
            light: '#34C759',
            DEFAULT: '#30D158',
            dark: '#00C843',
          },
          'red': {
            light: '#FF453A',
            DEFAULT: '#FF3B30',
            dark: '#FF2D20',
          },
          'yellow': {
            light: '#FFD60A',
            DEFAULT: '#FFCC00',
            dark: '#FFC300',
          },
          'purple': {
            light: '#BF5AF2',
            DEFAULT: '#AF52DE',
            dark: '#9F48CC',
          },
          'pink': {
            light: '#FF6482',
            DEFAULT: '#FF2D55',
            dark: '#FF1744',
          },
          'orange': {
            light: '#FF9F0A',
            DEFAULT: '#FF9500',
            dark: '#FF8800',
          },
          'teal': {
            light: '#5AC8FA',
            DEFAULT: '#00C7BE',
            dark: '#00B0A6',
          },
        }
      },
      fontSize: {
        // Apple-style typography scale
        'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-l': ['64px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-m': ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-s': ['40px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline': ['32px', { lineHeight: '1.125', letterSpacing: '-0.009em', fontWeight: '600' }],
        'title-l': ['28px', { lineHeight: '1.14', letterSpacing: '-0.007em', fontWeight: '600' }],
        'title-m': ['24px', { lineHeight: '1.16', letterSpacing: '-0.006em', fontWeight: '600' }],
        'title-s': ['20px', { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-l': ['17px', { lineHeight: '1.47', letterSpacing: '-0.022em', fontWeight: '400' }],
        'body-m': ['15px', { lineHeight: '1.46', letterSpacing: '-0.019em', fontWeight: '400' }],
        'body-s': ['13px', { lineHeight: '1.38', letterSpacing: '-0.016em', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.33', letterSpacing: '0', fontWeight: '400' }],
        'footnote': ['11px', { lineHeight: '1.36', letterSpacing: '0.06em', fontWeight: '400' }],
      },
      borderRadius: {
        'apple': '20px',
        'apple-sm': '12px',
        'apple-xs': '8px',
        'apple-button': '980px',
      },
      backdropBlur: {
        'apple': '20px',
      },
      boxShadow: {
        'apple': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'apple-xl': '0 20px 60px rgba(0, 0, 0, 0.2)',
        'apple-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'apple-bounce': 'apple-bounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'apple-fade-in': 'apple-fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-slide-up': 'apple-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-scale': 'apple-scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'apple-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'apple-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'apple-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'apple-scale': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'apple-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        'apple-mesh': `radial-gradient(at 40% 20%, rgba(0,113,227,0.2) 0px, transparent 50%),
                       radial-gradient(at 80% 0%, rgba(175,82,222,0.15) 0px, transparent 50%),
                       radial-gradient(at 0% 50%, rgba(0,199,190,0.15) 0px, transparent 50%),
                       radial-gradient(at 80% 100%, rgba(255,45,85,0.15) 0px, transparent 50%),
                       radial-gradient(at 0% 100%, rgba(255,149,0,0.15) 0px, transparent 50%)`,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config