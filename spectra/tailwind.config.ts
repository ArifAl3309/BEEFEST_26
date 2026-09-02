import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-hind)', 'sans-serif'],
      },
      colors: {
        spectra: {
          base: '#06080F',
          surface: '#0E121E',
          elevated: '#161D2F',
          border: '#1E293B',
          'border-strong': '#334155',
          blue: '#2563EB',
          cyan: '#06B6D4',
          normal: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}

export default config
