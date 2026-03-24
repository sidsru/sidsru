/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ue-orange': '#F15A24',
        'ue-blue': '#0091C2',
        'neon-cyan': '#00FFF0',
        'neon-orange': '#FF6B35',
        'dark-bg': '#050508',
        'dark-card': '#0A0A10',
        'dark-border': '#1A1A2E',
        'grid-line': 'rgba(0, 255, 240, 0.06)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },
      animation: {
        'scan-line': 'scanLine 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'float': 'float 6s ease-in-out infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'slide-in-left': 'slideInLeft 0.7s ease forwards',
        'slide-in-right': 'slideInRight 0.7s ease forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderGlow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 240, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 240, 0.7), 0 0 40px rgba(0, 255, 240, 0.3)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,255,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,240,0.04) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}