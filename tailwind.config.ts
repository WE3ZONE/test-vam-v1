import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        divar: {
          bg: '#1a1a1a',
          surface: '#242424',
          surfaceHover: '#2a2a2a',
          border: '#3a3a3a',
          text: '#f5f5f5',
          muted: '#9ca3af',
          primary: '#b91c1c',
          primaryHover: '#991b1b',
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
