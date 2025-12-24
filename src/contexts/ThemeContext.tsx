
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themePreference: ThemePreference;
    setThemePreference: (pref: ThemePreference) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
        const saved = localStorage.getItem('theme-preference');
        return (saved as ThemePreference) || 'system';
    });

    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('theme-preference', themePreference);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            const systemDark = mediaQuery.matches;
            let effectiveDark = false;

            if (themePreference === 'system') {
                effectiveDark = systemDark;
            } else {
                effectiveDark = themePreference === 'dark';
            }

            setIsDark(effectiveDark);

            // Apply to DOM
            if (effectiveDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [themePreference]);

    return (
        <ThemeContext.Provider value={{ themePreference, setThemePreference, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
