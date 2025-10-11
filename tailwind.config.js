module.exports = {
  content: [
    './app/views/**/*.{html,erb}',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.{js,jsx,ts,tsx}',
    './app/assets/stylesheets/**/*.{scss,css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          foreground: '#F8FAFC',
          muted: '#E0E7FF',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          foreground: '#0F172A',
          subtle: '#E2E8F0',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -20px rgba(15, 23, 42, 0.4)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        modern: {
          'primary': '#2563EB',
          'secondary': '#64748B',
          'accent': '#22D3EE',
          'neutral': '#1E293B',
          'base-100': '#F8FAFC',
          'base-200': '#E2E8F0',
          'base-300': '#CBD5F5',
          'info': '#0EA5E9',
          'success': '#22C55E',
          'warning': '#FACC15',
          'error': '#EF4444',
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '9999px',
          '--animation-btn': '0',
          '--btn-text-case': 'capitalize',
        },
      },
      'dark',
    ],
    darkTheme: 'dark',
  },
}
