/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        grey: 'var(--grey)',
        background: 'var(--background)',
        textDarkGrey: 'var(--textDarkGrey)',
        textLightGrey: 'var(--textLightGrey)',
        textPrimary: 'var(--textPrimary)',
        darkGrey: 'var(--darkGrey)',
      },
      borderRadius: {
        regular: 'var(--rounded)',
      },
    },
  },
  plugins: [],
}
