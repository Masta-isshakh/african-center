import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        navy: {
          50: '#EEF3F8',
          100: '#D6E1EC',
          200: '#ADC3D9',
          300: '#7FA0C0',
          400: '#4F79A3',
          500: '#2B5A86',
          600: '#15426B',
          700: '#052F57',
          800: '#042443',
          900: '#031A31',
          950: '#02101F',
          DEFAULT: '#052F57',
        },
        gold: {
          50: '#FBF6EA',
          100: '#F5E8C6',
          200: '#EBD18F',
          300: '#DFB95C',
          400: '#D4A83F',
          500: '#C99A2E',
          600: '#A87E22',
          700: '#86631A',
          800: '#644912',
          900: '#42300B',
          DEFAULT: '#C99A2E',
        },
        charcoal: '#101418',
        sand: '#F7F4EE',
        ink: '#1C2430',
        mist: '#E9EDF2',
        success: '#1F8A5B',
        warning: '#D98E04',
        error: '#C0392B',
        whatsapp: '#17784F', // success green darkened so white labels pass WCAG AA (≈5.3:1)
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        wordmark: ['var(--font-bodoni)', 'serif'],
        'wordmark-sans': ['var(--font-inter)', 'sans-serif'],
        'wordmark-ar': ['var(--font-cairo)', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.75rem, 6vw, 5.5rem)', { lineHeight: 'var(--lh-display)' }],
        'display-xl': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: 'var(--lh-display)' }],
        'display-lg': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: 'var(--lh-display)' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        layered: '0 1px 2px rgba(5,47,87,.06), 0 12px 32px -12px rgba(5,47,87,.18)',
        lift: '0 1px 2px rgba(5,47,87,.08), 0 24px 48px -16px rgba(5,47,87,.28)',
        glow: '0 0 0 1px rgba(201,154,46,.4), 0 24px 48px -16px rgba(201,154,46,.25)',
        glass: '0 8px 32px -12px rgba(2,16,31,.55)',
      },
      maxWidth: {
        site: '80rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-rtl': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(.6)', opacity: '.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'scroll-line': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        'ken-burns': {
          from: { transform: 'scale(1.08)' },
          to: { transform: 'scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-rtl': 'marquee-rtl 40s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(.2,.6,.3,1) infinite',
        'scroll-line': 'scroll-line 2.4s cubic-bezier(.65,0,.35,1) infinite',
        'ken-burns': 'ken-burns 18s ease-out forwards',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
