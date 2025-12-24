import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// Fraction component with proper horizontal bar (no slashes)
export const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode; color?: string }> = ({ n, d, color }) => (
    <span className="inline-flex flex-col items-center mx-0.5 leading-tight" style={{ color }}>
        <span className="text-xs">{n}</span>
        <span className="w-full border-t border-current" style={{ marginTop: '1px', marginBottom: '1px' }} />
        <span className="text-xs">{d}</span>
    </span>
);

// Identity card with proper styling
export const Card: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => {
    const theme = useTheme();
    const borderColor = color || theme.comp; // Use theme.comp as neutral color
    return (
        <div
            className="px-3 py-2 rounded-lg border text-center flex items-center justify-center"
            style={{
                borderColor,
                backgroundColor: color ? `${color}15` : 'transparent',
            }}
        >
            {children}
        </div>
    );
};

// Category section header
export const Category: React.FC<{ title: string; level?: string }> = ({ title, level }) => (
    <div className="mt-4 mb-2 first:mt-0">
        <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
            {level && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {level}
                </span>
            )}
        </div>
    </div>
);

// Colored function name
export const Fn: React.FC<{ name: 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'; sup?: string }> = ({ name, sup }) => {
    const theme = useTheme();
    return (
        <span style={{ color: theme[name] }}>
            {name}{sup && <sup>{sup}</sup>}
        </span>
    );
};
