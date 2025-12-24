/**
 * Shared Theme Context for Visual Trig.
 * Provides theme colors to all nested components.
 */

import { createContext, useContext } from 'react';
import { TrigTheme } from '../types';

/**
 * Theme context - provides trig function colors and UI colors to nested components.
 */
export const ThemeContext = createContext<TrigTheme | null>(null);

/**
 * Hook to access theme colors from context.
 * @throws Error if used outside of ThemeContext.Provider
 */
export const useTheme = (): TrigTheme => {
    const theme = useContext(ThemeContext);
    if (!theme) {
        throw new Error('useTheme must be used within a ThemeContext.Provider');
    }
    return theme;
};
