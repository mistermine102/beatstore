/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        darkPrimary: 'var(--darkPrimary)',
        grey: 'var(--grey)',
        midGrey: 'var(--midGrey)',
        darkGrey: 'var(--darkGrey)',
        background: 'var(--background)',
        textDarkGrey: 'var(--textDarkGrey)',
        textLightGrey: 'var(--textLightGrey)',
        iconLightGrey: 'var(--iconLightGrey)',
      },
      borderRadius: {
        regular: 'var(--rounded)',
      },
    },
  },
  plugins: [],
}
