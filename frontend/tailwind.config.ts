const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#1f2937',
        light: '#f9fafb',
      },
      spacing: {
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
