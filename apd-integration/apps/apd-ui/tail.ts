import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6200EE',
        secondary: '#03DAC6',
        surface: '#FFFFFF',
        background: '#F5F5F5',
        textPrimary: '#212121',
        textSecondary: '#757575',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;