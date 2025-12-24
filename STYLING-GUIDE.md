# TrigFlow Styling Guide

Canonical reference for visual design tokens and patterns.

## Color Palette

### Trig Function Colors

| Function | Color | Hex |
|----------|-------|-----|
| sin | Red | `#ff6b6b` |
| cos | Blue | `#4dabf7` |
| tan | Orange | `#ff922b` |
| cot | Green | `#51cf66` |
| sec | Purple | `#cc5de8` |
| csc | Yellow | `#fcc419` |

### UI Colors

| Token | Light | Dark |
|-------|-------|------|
| grid | `#e1e4e8` | `#343a40` |
| axis | `#333333` | `#ced4da` |
| text | `#333333` | `#f8f9fa` |
| bg | `#ffffff` | `#212529` |
| comp | `#888888` | `#adb5bd` |

## Typography

- **Root Font**: `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`
- **Canvas Labels**: Bold 14px (use root font, not Arial)
- **Graph Axis**: 10px sans-serif
- **Quadrant Labels**: Bold 120px Times New Roman

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
- **Theme context**: `src/context/ThemeContext.tsx`
- **Tailwind tokens**: `tailwind.config.js`
- **Types**: `src/types/index.ts`

## Anti-Patterns (Avoid These)

### ❌ Hardcoded Colors
```tsx
// BAD - will break if theme changes
<Toggle color="#e74c3c" />
ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';

// GOOD - uses theme from props/context
<Toggle color={theme.sin} />
ctx.fillStyle = withAlpha(theme.cos, OVERLAY_ALPHA.medium);
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

## Best Practices

1. **Import theme colors** via props or `useTheme()` context, never hardcode hex values
2. **Use canvas/helpers.ts** for drawing primitives
3. **Use theme/overlays.ts** for transparent fills
4. **Test both light and dark modes** after color changes
5. **Run `npm run build`** to catch TypeScript errors before committing

---
*Last updated: 2025-12-24*
