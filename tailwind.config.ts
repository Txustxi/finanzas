import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    './src/**/*.{ts,tsx,jsx,js}',
    './app/**/*.{ts,tsx,jsx,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
