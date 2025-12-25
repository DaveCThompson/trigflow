/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                heading: ['Nunito', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                trig: {
                    sin: 'var(--color-sin)',
                    cos: 'var(--color-cos)',
                    tan: 'var(--color-tan)',
                    cot: 'var(--color-cot)',
                    sec: 'var(--color-sec)',
                    csc: 'var(--color-csc)',
                },
                ui: {
                    grid: 'var(--border-subtle)',
                    axis: 'var(--text-1)', // Fallback, context dep
                    text: {
                        DEFAULT: 'var(--text-1)',
                        muted: 'var(--text-2)'
                    },
                    bg: {
                        main: 'var(--surface-1)',
                        panel: 'var(--surface-2)',
                        hover: 'var(--surface-3)'
                    },
                    border: 'var(--border-subtle)'
                },
                canvas: {
                    bg: 'var(--canvas-bg)',
                    grid: 'var(--canvas-grid)',
                    'dot-bg': 'var(--canvas-dot-bg)',
                },
                action: {
                    primary: 'var(--action-primary)',
                    'primary-hover': 'var(--action-primary-hover)',
                    danger: 'var(--action-danger)',
                    'danger-subtle': 'var(--action-danger-subtle)',
                    'secondary-hover': 'var(--action-secondary-hover)',
                },
                surface: {
                    selected: 'var(--surface-selected)',
                    'selected-text': 'var(--surface-selected-text)',
                },
                border: {
                    focus: 'var(--border-focus)',
                    selected: 'var(--border-selected)',
                }
            },
            backgroundImage: {
                'page-gradient': 'var(--bg-gradient-page)',
            },
            boxShadow: {
                'soft': '0 8px 30px rgb(0 0 0 / 0.04)',
                'glow': '0 0 20px -5px var(--shadow-color)', // Dynamic shadow
                'sin': '0 4px 14px 0 rgba(255, 107, 107, 0.39)',     // Hardcoded fallback or use var if supported in arbitrary values? 
                // Better to use arbitrary values in code: shadow-[0_4px_14px_0_var(--color-sin)]
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
                '4xl': '32px',
            },
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }
        },
    },
    plugins: [],
}
