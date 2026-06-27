import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        divar: {
          bg: 'var(--d-bg)',
          surface: 'var(--d-surface)',
          surfaceHover: 'var(--d-surface-hover)',
          border: 'var(--d-border)',
          text: 'var(--d-text)',
          muted: 'var(--d-muted)',
          primary: 'var(--d-primary)',
          primaryHover: 'var(--d-primary-hover)',
          success: '#16a34a',
          warning: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
