import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wyze: {
          green: '#1DF0BB',
          'green-dark': '#00A288',
          purple: '#4E2FD2',
          'purple-light': '#B8C4FF',
        },
        bg: {
          base: '#0a0a0a',
          elevated: '#1a1a1a',
          sunken: '#050505',
        },
        text: {
          primary: '#ffffff',
          secondary: '#C8C8C8',
          muted: '#A0A0A0',
          faint: '#787878',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(29,240,187,0.12), rgba(78,47,210,0.18))',
        'brand-gradient': 'linear-gradient(135deg, #1DF0BB, #4E2FD2)',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
} satisfies Config;
