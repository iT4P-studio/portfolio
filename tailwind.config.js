/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // もし layouts や他ディレクトリがある場合は追加
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
