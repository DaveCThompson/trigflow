/**
 * Theme overlay utilities for Visual Trig.
 * Provides helpers for creating alpha-blended color variations.
 */

/**
 * Convert a color to string with specified alpha.
 * Supports Hex and OKLCH strings.
 * @param color - Color string (Hex or OKLCH)
 * @param alpha - Alpha value between 0 and 1
 * @returns Color string with alpha
 */
export const withAlpha = (color: string, alpha: number): string => {
    // Handle OKLCH
    if (color.startsWith('oklch')) {
        // oklch(L C H) -> oklch(L C H / alpha)
        const parts = color.replace('oklch(', '').replace(')', '').split(/\s+/);
        // Reconstruct with alpha slash
        // If there was already a slash, we replace the alpha
        const mainParts = parts.filter(p => !p.includes('/'));
        // Take first 3 components
        return `oklch(${mainParts.slice(0, 3).join(' ')} / ${alpha})`;
    }

    // Handle Hex (legacy fallback)
    let fullHex = color;
    if (color.startsWith('#')) {
        if (color.length === 4) {
            fullHex = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        const r = parseInt(fullHex.slice(1, 3), 16);
        const g = parseInt(fullHex.slice(3, 5), 16);
        const b = parseInt(fullHex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return color; // Fallback for unknown formats
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
