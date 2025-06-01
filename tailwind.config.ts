import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                shake: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(-2deg)' },
                    '75%': { transform: 'rotate(2deg)' },
                }
            },
            animation: {
                blink: 'blink 1s step-end infinite',
                shake: 'shake 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
export default config 