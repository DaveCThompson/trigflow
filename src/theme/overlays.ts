/**
 * Theme overlay utilities for TrigFlow.
 * Provides helpers for creating alpha-blended color variations.
 */

/**
 * Convert a hex color to RGBA string with specified alpha.
 * @param hex - Hex color string (e.g., '#ff6b6b')
 * @param alpha - Alpha value between 0 and 1
 * @returns RGBA color string
 */
export const withAlpha = (hex: string, alpha: number): string => {
    // Handle shorthand hex colors
    let fullHex = hex;
    if (hex.length === 4) {
        fullHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    const r = parseInt(fullHex.slice(1, 3), 16);
    const g = parseInt(fullHex.slice(3, 5), 16);
    const b = parseInt(fullHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Preset overlay alpha values for consistent visual hierarchy.
 */
export const OVERLAY_ALPHA = {
    /** Very subtle fill for large areas */
    subtle: 0.05,
    /** Standard background fill */
    fill: 0.1,
    /** Slightly stronger fill for emphasis */
    medium: 0.15,
    /** Hover state backgrounds */
    hover: 0.2,
    /** Strong emphasis */
    strong: 0.3,
};

/**
 * Create theme-aware halo color for text legibility.
 * @param isDark - Whether the theme is dark mode
 * @returns RGBA color string for text halo/stroke
 */
export const getHaloColor = (isDark: boolean): string => {
    return isDark
        ? 'rgba(0, 0, 0, 0.4)'
        : 'rgba(255, 255, 255, 0.6)';
};
