# Visualization Strategy

Design principles for mathematical visualizations in TrigFlow.

## Core Philosophy

**Show, don't tell.** Mathematical relationships should be immediately visible, not explained with text. A well-designed visualization makes equations obvious.

## Color System

### Function Colors

Each trig function has a dedicated color used consistently across all visualizations:

| Function | Color | Hex |
|----------|-------|-----|
| sin | Red | `#ff6b6b` |
| cos | Blue | `#4dabf7` |
| tan | Orange | `#ff922b` |
| cot | Green | `#51cf66` |
| sec | Purple | `#cc5de8` |
| csc | Yellow | `#fcc419` |

### Proof Colors

For geometric proofs, use distinct colors that suggest relationships:

- **Triangles**: Pink/indigo pairs for congruent shapes
- **Squares**: Teal for c², blue for a², red for b²
- **Labels**: Cyan (`#22d3ee`) for hypotenuse markers

## Canvas Rendering

### Layer Order

Draw elements in consistent order for proper z-indexing:
1. Background/grid
2. Outer boundaries
3. Filled shapes (lowest opacity first)
4. Strokes and outlines
5. Labels and text

### Text Legibility

- Use `Inter` or system fonts for clarity
- Bold weights for labels (11-14px)
- Offset labels from edges (8-14px padding)
- Use rotation for vertical axis labels

### High-DPI Support

Always account for device pixel ratio:

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

## Interactive Elements

- Draggable angle control on unit circle
- Hover states for function toggles
- Click-to-reveal for proof steps

## Accessibility

- Sufficient color contrast
- Labels on all geometric elements
- Step-by-step progression for proofs
