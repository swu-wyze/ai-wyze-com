import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
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
        // Theme-aware purple accent — wyze-purple in light mode, wyze-purple-light in dark.
        // Use this for any purple text/border meant to stay legible across both themes.
        accent: {
          purple: 'rgb(var(--accent-purple) / <alpha-value>)',
        },
        // Theme-swapping tokens. RGB-tuple vars so Tailwind alpha modifiers
        // (e.g. bg-bg-base/[0.92]) work.
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          sunken: 'rgb(var(--bg-sunken) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          faint: 'rgb(var(--text-faint) / <alpha-value>)',
        },
        // Surface overlays — pre-baked alpha, no modifier needed
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          faint: 'var(--border-faint)',
          subtle: 'var(--border-subtle)',
          medium: 'var(--border-medium)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'var(--hero-gradient)',
        'brand-gradient': 'var(--brand-gradient)',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
} satisfies Config;
