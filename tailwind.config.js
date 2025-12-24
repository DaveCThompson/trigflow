/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                trig: {
                    sin: '#ff6b6b',
                    cos: '#4dabf7',
                    tan: '#ff922b',
                    cot: '#51cf66',
                    sec: '#cc5de8',
                    csc: '#fcc419',
                },
                ui: {
                    grid: { light: '#e1e4e8', dark: '#343a40' },
                    axis: { light: '#333333', dark: '#ced4da' },
                    text: { light: '#333333', dark: '#f8f9fa' },
                    bg: { light: '#ffffff', dark: '#212529' },
                    comp: { light: '#888888', dark: '#adb5bd' },
                }
            }
        },
    },
    plugins: [],
}

