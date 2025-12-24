// Theme color configurations for TrigFlow
import { TrigTheme } from '../types';

export const LIGHT_THEME: TrigTheme = {
    sin: 'oklch(65% 0.22 25)',      // Red/Pink - Adjusted for better contrast
    cos: 'oklch(65% 0.18 250)',     // Blue - Adjusted for better contrast
    tan: 'oklch(75% 0.18 60)',      // Orange
    cot: 'oklch(80% 0.18 150)',     // Mint Green
    sec: 'oklch(70% 0.20 300)',     // Purple
    csc: 'oklch(75% 0.18 100)',     // Yellow (darkened slightly for visibility)

    grid: 'oklch(88% 0.02 240)',    // Slate 300 equiv (cool grey)
    axis: 'oklch(45% 0.05 260)',    // Slate 600 equiv
    text: 'oklch(25% 0.02 260)',    // Dark text
    bg: 'oklch(96% 0.01 240)',      // Slightly darker background for canvas/graphs (Light Mode) based on user req
    comp: 'oklch(60% 0.02 260)',

    label_primary: 'oklch(25% 0.02 260)',    // Slate 800 equiv
    label_secondary: 'oklch(45% 0.05 260)',  // Slate 600 equiv
    label_on_fill: 'oklch(25% 0.02 260)',
    halo: 'rgba(255, 255, 255, 0.85)',       // Keep rgba for canvas halo unless we write a converter

    isDark: false
};

export const DARK_THEME: TrigTheme = {
    sin: 'oklch(75% 0.15 25)',
    cos: 'oklch(75% 0.15 260)',
    tan: 'oklch(80% 0.15 60)',
    cot: 'oklch(80% 0.15 150)',
    sec: 'oklch(75% 0.15 300)',
    csc: 'oklch(85% 0.15 100)',

    grid: 'oklch(35% 0.03 260)',    // Slate 700 equiv
    axis: 'oklch(70% 0.03 260)',    // Slate 400 equiv
    text: 'oklch(96% 0.01 240)',
    bg: 'oklch(20% 0.02 260)',      // Dark background
    comp: 'oklch(75% 0.02 260)',

    label_primary: 'oklch(98% 0.01 240)',    // Slate 50 equiv
    label_secondary: 'oklch(88% 0.02 240)',  // Slate 300 equiv
    label_on_fill: 'oklch(100% 0 0)',
    halo: 'rgba(33, 37, 41, 0.85)',          // Dark Halo

    isDark: true
};
