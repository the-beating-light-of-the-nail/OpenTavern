import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './stores/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
        plum: {
          DEFAULT: 'rgb(var(--color-text-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-text-soft-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--color-text-faint-rgb) / <alpha-value>)',
        },
        rose: {
          tint: 'rgb(var(--color-surface-soft-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          deep: 'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
        },
        champagne: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        lavender: 'rgb(var(--color-lavender-rgb) / <alpha-value>)',
        'border-warm': 'rgb(var(--color-border-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        // 乙女向展示衬线：西文 Cormorant Garamond（无 CJK 字形自动回退）→ 中文 Noto Serif SC → 系统宋体
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', '"Songti SC"', '"SimSun"', 'serif'],
      },
      borderRadius: {
        brand: 'var(--radius-md)',
        'brand-lg': 'var(--radius-lg)',
      },
      boxShadow: {
        brand: 'var(--shadow-card)',
        focus: 'var(--shadow-focus)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
      },
    },
  },
  plugins: [],
};
