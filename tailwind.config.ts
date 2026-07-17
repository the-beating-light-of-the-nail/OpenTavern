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
        ivory: '#fbf4f2',
        plum: {
          DEFAULT: '#3d2b3d',
          light: '#6a5a6a',
          muted: '#7a6a7a',
          faint: '#9a8a9a',
        },
        rose: {
          tint: '#fdf0f3',
          accent: '#ca7690',
          deep: '#b86581',
        },
        champagne: '#d4ab72',
        lavender: '#d9c7e8',
        'border-warm': '#f0e3e1',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        // 乙女向展示衬线：西文 Cormorant Garamond（无 CJK 字形自动回退）→ 中文 Noto Serif SC → 系统宋体
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', '"Songti SC"', '"SimSun"', 'serif'],
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
