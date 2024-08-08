const {fontFamily} = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            lineHeight: {
                11: '2.75rem',
                12: '3rem',
                13: '3.25rem',
                14: '3.5rem',
            },
            fontFamily: {
                sans: ['Onest', ...fontFamily.sans],
            },
            colors: {
                primary: colors.pink,
                gray: colors.gray,
            },
            typography: ({theme}) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme('colors.blue.500'),
                            '&:hover': {
                                color: `${theme('colors.blue.600')}`,
                            },
                            code: {color: theme('colors.blue.400')},
                        },
                        'h1,h2': {
                            fontWeight: '700',
                            letterSpacing: theme('letterSpacing.tight'),
                        },
                        'h2, h3, h4, h5, h6': {
                            marginTop: '3rem',
                            marginBottom: '1.5rem',
                        },
                        h3: {
                            fontWeight: '600',
                        },
                        code: {
                            color: theme('colors.blue.500'),
                        },
                    },
                },
                invert: {
                    css: {
                        a: {
                            color: theme('colors.blue.500'),
                            '&:hover': {
                                color: `${theme('colors.blue.400')}`,
                            },
                            code: {color: theme('colors.blue.400')},
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            color: theme('colors.gray.100'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
    safelist: ['xl:max-w-4xl', 'xl:max-w-2xl'],

}
