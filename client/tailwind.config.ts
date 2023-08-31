import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      listStyleType: {
        square: 'square',
        alphaLower: 'lower-alpha',
        alphaUpper: 'upper-alpha',
      },
      boxShadow: {
        primary: '0 15px 35px rgba(0 0 0/.15)',
      },
      keyframes: {
        marquee: {
          '0%': {
            left: '100%',
          },
          '100%': {
            left: '-100%',
          },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  tailwindFunctions: ['classNames'],
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
