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

## Tailwind Tokens

Colors are available via Tailwind classes:
- `text-trig-sin`, `bg-trig-sin`, `border-trig-sin`
- `text-trig-cos`, `bg-trig-cos`, etc.

## Sources of Truth

- **Color definitions**: `src/theme/colors.ts`
- **Tailwind tokens**: `tailwind.config.js`
- **Types**: `src/types/index.ts`
