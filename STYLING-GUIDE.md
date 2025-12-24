# TrigFlow Styling Guide

Canonical reference for visual design tokens and patterns.

## Color Palette

### Trig Function Colors (OKLCH)

| Function | Color (OKLCH) | Approx |
|----------|---------------|--------|
| sin | `oklch(65% 0.22 25)` | Red/Pink |
| cos | `oklch(65% 0.18 250)` | Blue |
| tan | `oklch(75% 0.18 60)` | Orange |
| cot | `oklch(80% 0.18 150)` | Mint |
| sec | `oklch(70% 0.20 300)` | Purple |
| csc | `oklch(75% 0.18 100)` | Yellow |

### UI Colors

| Token | Light | Dark |
|-------|-------|------|
| grid | `oklch(88% 0.02 240)` | `oklch(35% 0.03 260)` |
| axis | `oklch(45% 0.05 260)` | `oklch(70% 0.03 260)` |
| text | `oklch(25% 0.02 260)` | `oklch(96% 0.01 240)` |
| canvas-bg | `oklch(96% 0.01 240)` | `oklch(20% 0.02 260)` |
| comp | `oklch(60% 0.02 260)` | `oklch(75% 0.02 260)` |

### Canvas Contrast Tokens

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| `label_primary` | Slate 800 (`#1e293b`) | Slate 50 (`#f8fafc`) | Main Axis/Grid labels |
| `label_secondary` | Slate 600 (`#475569`) | Slate 300 (`#cbd5e1`) | Ticks and subtitles |
| `label_on_fill` | Slate 800 (`#1e293b`) | White (`#ffffff`) | Text on filled shapes (wedges) |
| `halo` | White 85% | Dark Slate 85% (`#212529`) | Text outline/glow for contrast |

### Interactive State Tokens

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| `action_primary` | `oklch(65% 0.18 250)` | `oklch(75% 0.15 260)` | Main CTA color (cos blue) |
| `action_primary_hover` | `oklch(60% 0.20 250)` | `oklch(80% 0.18 260)` | Hover state for primary actions |
| `action_danger` | `oklch(60% 0.20 25)` | `oklch(70% 0.18 25)` | Destructive actions (reset button) |
| `action_danger_subtle` | `oklch(98% 0.01 25)` | `oklch(25% 0.02 25)` | Danger background with low opacity |

### Selection & Focus Tokens

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| `surface_selected` | `oklch(100% 0 0)` | `oklch(30% 0.02 260)` | Selected item background |
| `surface_selected_text` | `oklch(15% 0.02 260)` | `oklch(100% 0 0)` | Text on selected background |
| `border_focus` | `oklch(65% 0.18 250)` | `oklch(75% 0.15 260)` | Focus ring color |
| `border_selected` | `oklch(65% 0.18 250)` | `oklch(75% 0.15 260)` | Selected item border |

### Specialized Tokens

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| `fill_angle_wedge` | Blue @ 15% opacity | Blue @ 12% opacity | Theta angle fill |

## Component Library

Always use these shared components instead of matching primitives.

### Button (`src/components/shared/Button.tsx`)
- **Usage**: Primary actions, secondary navigation, icon-only triggers.
- **Variants**: `primary`, `secondary`, `danger`, `ghost`.
- **Features**: Hover lift, active bounce, subtle shadow.

### Toggle (`src/components/shared/Toggle.tsx`)
- **Usage**: Boolean state switches.
- **Features**: Spring animation, specific track colors (use semantic tokens).

### ControlSection (`src/components/shared/ControlSection.tsx`)
- **Usage**: Grouping controls in the right-hand panel.
- **Features**: Collapsible with smooth height transition, `font-heading` headers.

## Typography

- **Headings**: `Nunito` (700/800) - Friendly, rounded, modern.
- **Body**: `Inter` (400/500/600) - Clean, highly legible.
- **Monospace**: `JetBrains Mono` (500) - Tabular numbers, code.
- **Canvas Labels**: **Bold** 14px Nunito.

## Canvas Rendering

### Layer Order (Z-Index)
1. Background/grid
2. Outer boundaries
3. Filled shapes (lowest opacity first)
4. Strokes and outlines
5. Labels and text

### High-DPI Support
Always account for device pixel ratio:
```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

## Overlay Utilities

Use `theme/overlays.ts` for transparent color variations:

```typescript
import { withAlpha, OVERLAY_ALPHA } from '../theme/overlays';

// Fill with 10% opacity
ctx.fillStyle = withAlpha(theme.sin, OVERLAY_ALPHA.fill);

// Custom alpha
ctx.fillStyle = withAlpha(theme.cos, 0.25);
```

### Preset Alpha Values

| Token | Value | Use Case |
|-------|-------|----------|
| `subtle` | 0.05 | Large background areas |
| `fill` | 0.10 | Standard shape fills |
| `medium` | 0.15 | Emphasized fills |
| `hover` | 0.20 | Hover state backgrounds |
| `strong` | 0.30 | Strong emphasis |

## Tailwind Tokens

Colors are available via Tailwind classes:
- Trig functions: `text-trig-sin`, `bg-trig-sin`, `border-trig-sin`, etc.
- UI colors: `text-ui-grid-light`, `bg-ui-bg-dark`, etc.

## Sources of Truth

- **Color definitions**: `src/theme/colors.ts`
- **Overlay utilities**: `src/theme/overlays.ts`
- **Theme context**: `src/contexts/ThemeContext.tsx`
- **Tailwind tokens**: `tailwind.config.js`
- **Types**: `src/types/index.ts`

## Anti-Patterns (Avoid These)

### ❌ Hardcoded Colors
```tsx
// BAD - will break if theme changes
<button className="bg-red-50 text-red-500" />
ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';

// GOOD - uses semantic tokens from theme
<button className="bg-action-danger-subtle text-action-danger" />
ctx.fillStyle = theme.fill_angle_wedge;
```

### ❌ Duplicate Type Definitions
```typescript
// BAD - duplicates types/index.ts
interface UnitCircleState { ... }

// GOOD - imports from single source
import { UnitCircleState } from '../../types';
```

### ❌ Wrong Import Source
```typescript
// BAD - imports from re-export
import { UnitCircleState } from './UnitCircleRenderer';

// GOOD - imports from canonical source
import { UnitCircleState } from '../../types';
```

### ❌ Magic Numbers in Canvas
```typescript
// BAD - unexplained values
ctx.arc(CX, CY, 4.2, 0, Math.PI * 2);

// GOOD - use named constants
const RADIUS_SCALE = 4.2; // Provides padding for labels
ctx.arc(CX, CY, RADIUS_SCALE, 0, Math.PI * 2);
```

### ❌ Inconsistent Canvas Text
```typescript
// BAD - using generic text color on colored background (low contrast risk)
ctx.fillStyle = theme.text;
ctx.fillText("θ", x, y);

// GOOD - using semantic token + halo
ctx.strokeStyle = theme.halo;
ctx.strokeText("θ", x, y);
ctx.fillStyle = theme.label_on_fill;
ctx.fillText("θ", x, y);
```

## Best Practices

1. **Import theme colors** via `useTheme()` hook context or props, never hardcode hex values
2. **Use canvas/helpers.ts** for drawing primitives
3. **Use theme/overlays.ts** for transparent fills
4. **Test both light and dark modes** after color changes
5. **Run `npm run build`** to catch TypeScript errors before committing

## UI Craft Standards

### 1. Vertical Alignment
- **Interactive Elements**: Must be optically centered.
    - **Toggles**: Use Flexbox (`items-center`) for thumb alignment. Do not use absolute positioning (`top-1`) if it risks off-by-pixel errors.
    - **Sliders**: calculating negative margins must account for exact thumb/track dimensions.
        - Formula: `margin-top = (thumbHeight - trackHeight) / -2`

### 2. Focus & Accessibility
- **Focus Rings**: Never clip focus rings (`outline`, `ring`).
    - Containers must have `overflow-visible` or sufficient padding (min `p-1`) if children have focus rings.
    - **Special Angles**: Ensure grid containers have enough gap/padding.

### 3. Canvas Rendering (Theme Awareness)
- **Text Labels**:
    - **Light Mode**: White halo (standard).
    - **Dark Mode**: **Dark halo** (matching background) required.
    - **Implementation**: Always pass `theme.halo` to `drawText`.
    - ❌ `drawText(ctx, "x", p, theme.text)` (Uses default white halo -> Bad in Dark Mode)
    - ✅ `drawText(ctx, "x", p, theme.text, "center", "middle", theme.halo)`

### 4. Selection States
- **Contrast**: Selected items must use `surface-selected` (high contrast) background with `surface-selected-text`.
- **Borders**: selected items should distinguish via border AND background.

---
*Last updated: 2025-12-24 (v0.3.0)*
