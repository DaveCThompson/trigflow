# design_facelift_plan.md

## Overview
This document outlines the master plan for the "Pastel Aesthetic Facelift" of Visual Trig. The goal is to transition from the current "functional" design to a high-craft "Pastel & Friendly" aesthetic, supporting both Light and Dark modes using OKLCH color spaces.

## 1. Typography & Global Layout
**Objective:** Friendly, readable, and modern.

-   **Headings:** [Nunito](https://fonts.google.com/specimen/Nunito) (Rounded sans-serif) - weight 700/800.
-   **Body:** [Inter](https://fonts.google.com/specimen/Inter) or [Quicksand](https://fonts.google.com/specimen/Quicksand) - weight 400/500/600.
-   **Code/Numbers:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) or `ui-monospace`.

**Implementation:**
-   Import via Google Fonts in `index.html`.
-   Update Tailwind config to set these as defaults.

## 2. Color Palette Strategy (OKLCH)
We will switch to `oklch()` for perceptually uniform colors. Using CSS variables for semantic tokens allows for instant theme switching without a flash of unstyled content.

### Core Logic Colors (Pastel)
Distinct but soft. High lightness, moderate chroma.

| Function | Hue | Lightness | Chroma | CSS Var Name |
| :--- | :--- | :--- | :--- | :--- |
| **Sin** (Red) | 25 | 75% | 0.15 | `--color-sin` |
| **Cos** (Blue) | 260 | 75% | 0.15 | `--color-cos` |
| **Tan** (Orange) | 60 | 80% | 0.15 | `--color-tan` |
| **Cot** (Green) | 150 | 80% | 0.15 | `--color-cot` |
| **Sec** (Purple) | 300 | 75% | 0.15 | `--color-sec` |
| **Csc** (Yellow) | 100 | 85% | 0.15 | `--color-csc` |

### Semantic UI Layers
Moving away from hardcoded hex values to semantic layers.

| Token | Light Mode (OKLCH) | Dark Mode (OKLCH) | Usage |
| :--- | :--- | :--- | :--- |
| `--surface-1` | `98% 0.01 240` (Cool White) | `20% 0.02 260` (Deep Navy) | Main App Background |
| `--surface-2` | `100% 0 0` (Pure White) | `25% 0.02 260` (Panel Navy) | Panel Cards |
| `--surface-3` | `96% 0.01 240` (Offset) | `30% 0.02 260` (Highlight) | Hover states, Inputs |
| `--text-1` | `30% 0.02 260` (Deep Gray) | `95% 0.01 240` (Off White) | Headings, Primary Text |
| `--text-2` | `50% 0.02 260` (Mid Gray) | `70% 0.01 240` (Muted) | Secondary, Labels |
| `--border-subtle`| `92% 0.005 260` | `35% 0.01 260` | Dividers, Grids |

## 3. Iconography
Migrate to **[Phosphor Icons](https://phosphoricons.com/)** for a consistent, friendly look.
-   **Style:** `Duotone` or `Fill`.
-   **Weight:** `Bold` for small UI elements to maintain readability.
-   **Usage:**
    -   Play/Pause: `PlayCircle`, `PauseCircle`
    -   Controls: `Gear`, `ArrowCounterClockwise` (Reset)
    -   Chevrons: `CaretDown`, `CaretRight`
    -   Toggles: Checkmarks or custom indicators.

## 4. Component Facelift Specifications

### Cards (Panels)
-   **Border Radius:** `rounded-3xl` (24px).
-   **Shadow:** `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` (Soft, large diffuse shadow).
-   **Border:** `1px solid var(--border-subtle)`.
-   **Effect:** Optional glassmorphism on sticky headers? `backdrop-blur-md bg-white/80`.

### Controls & Toggles
-   **Toggles:** Custom SVG switch.
    -   **Track:** Pill shape, `h-6 w-10`.
    -   **Thumb:** Circle `h-5 w-5`, white, with subtle shadow.
    -   **Animation:** Spring transition on toggle.
    -   **Active State:** Background becomes the specific function color (e.g., Pink for Sin) if applicable, or primary Blue.
-   **Sliders:** Remove default appearance.
    -   **Track:** Thick rounded track (`h-2`).
    -   **Thumb:** Large circle (`h-5 w-5`) with shadow and hover expansion.
-   **Buttons:**
    -   **Create:** "Squircle" or full pill shapes.
    -   **Interaction:** `active:scale-95` click bounce. `hover:-translate-y-0.5` lift.

### Readout & Lists
-   **List Items:** Increase padding. Add `hover:bg-[--surface-3]` with `rounded-xl`.
-   **Values:** Use monospace font for numbers to prevent layout jitter.

## 5. Motion & Interaction (The "Subtle Details")
-   **Transitions:** Global `* { transition: background-color 0.3s ease, border-color 0.3s ease; }` is too heavy. Apply specific transitions to `bg`, `text`, `border` on container elements.
-   **Micro-interactions:**
    -   **Hover:** Buttons lift slightly and brighten.
    -   **Focus:** Soft, colored ring (matching brand color) instead of browser default.
    -   **Panel Open/Close:** `AnimateHeight` or similar smooth expansion.

## 6. Chart & Canvas Updates
-   **Theme Integration:** Canvas must observe CSS variables or `ThemeContext` values derived from them.
-   **Line Styles:**
    -   **Grid:** Dashed, extremely subtle.
    -   **Main Circle:** Thicker stroke (`2.5px`).
    -   **Trig Functions:** "Glow" effect? (Draw line twice: once opaque 2px, once broad 6px with low opacity).
    -   **Labels:** Use the new font family (Nunito) inside the canvas drawing calls.

## 7. Execution Checklist
-   [ ] **Setup:** Install Phosphor icons (`@phosphor-icons/react`), add Google Fonts.
-   [ ] **Theme Engine:** Define CSS variables in `index.css` (:root and .dark). Update `tailwind.config.js` to reference `var(--...)`.
-   [ ] **Refactor Components:**
    -   `App.tsx` (Layout container)
    -   `LessonPanel.tsx` (Typography, Buttons)
    -   `Controls.tsx` (New Toggles, Sliders)
    -   `ReadoutPanel.tsx` (Monospace nums, spacing)
-   [ ] **Canvas Upgrade:** Update `UnitCircleRenderer` to use new colors and font. Add "glow" drawing helper.
-   [ ] **Verification:** Check dark mode toggle, responsive layout, and contrast ratios.
