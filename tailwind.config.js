/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',  // Habilita o modo Just-In-Time
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.ts',
    ],
    options: {
      safelist: [],
    },
  },
  darkMode: false,
  theme: {
    extend: {

      colors: {
        'custom-color': '#123456',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  variants: {

    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    // Aqui você pode adicionar plugins do Tailwind
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // ...
  ],
}

