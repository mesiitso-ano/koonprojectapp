/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        koon: {
          bg: '#0d0d0d',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          accent: '#7c3aed',
          'accent-hover': '#6d28d9',
          text: '#e5e7eb',
          muted: '#6b7280',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
