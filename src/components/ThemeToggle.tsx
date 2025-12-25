
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';
import { clsx } from 'clsx';

export const ThemeToggle: React.FC = () => {
    const { themePreference, setThemePreference } = useTheme();

    return (
        <div className="flex bg-ui-bg-panel/50 backdrop-blur-sm border border-ui-border rounded-full p-1 gap-1">
            <button
                onClick={() => setThemePreference('light')}
                className={clsx(
                    "p-1.5 rounded-full transition-colors text-ui-text-muted hover:text-ui-text",
                    themePreference === 'light' && "bg-surface-selected text-trig-sin shadow-sm"
                )}
                title="Light Mode"
            >
                <Sun weight={themePreference === 'light' ? 'fill' : 'regular'} className="w-4 h-4" />
            </button>
            <button
                onClick={() => setThemePreference('system')}
                className={clsx(
                    "p-1.5 rounded-full transition-colors text-ui-text-muted hover:text-ui-text",
                    themePreference === 'system' && "bg-surface-selected text-trig-cos shadow-sm"
                )}
                title="System Theme"
            >
                <Desktop weight={themePreference === 'system' ? 'fill' : 'regular'} className="w-4 h-4" />
            </button>
            <button
                onClick={() => setThemePreference('dark')}
                className={clsx(
                    "p-1.5 rounded-full transition-colors text-ui-text-muted hover:text-ui-text",
                    themePreference === 'dark' && "bg-surface-selected text-trig-sec shadow-sm"
                )}
                title="Dark Mode"
            >
                <Moon weight={themePreference === 'dark' ? 'fill' : 'regular'} className="w-4 h-4" />
            </button>
        </div>
    );
};
