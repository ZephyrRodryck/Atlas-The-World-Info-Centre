import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0F1E',
          50: '#1A2140',
          100: '#151B35',
          200: '#10162A',
          300: '#0D1224',
          400: '#0A0F1E',
          500: '#070B16',
          600: '#04060D',
          700: '#020305',
        },
        silver: {
          DEFAULT: '#8FA3C7',
          50: '#E8EDF4',
          100: '#D1DAE9',
          200: '#B9C7DE',
          300: '#A2B5D3',
          400: '#8FA3C7',
          500: '#6E8AB5',
          600: '#52729F',
          700: '#3F587A',
        },
        copper: {
          DEFAULT: '#E8743B',
          50: '#FCEEE5',
          100: '#F9DDCC',
          200: '#F4BA99',
          300: '#EE9767',
          400: '#E8743B',
          500: '#D15A1F',
          600: '#A04618',
          700: '#703111',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
