---
description: How to add a new proof visualization to TrigFlow
---

# Adding a Proof Visualization

Follow these steps to add an animated proof visualization.

## Steps

1. **Define proof toggle** in `src/types/index.ts`
   - Use `proof_` prefix for proof-related toggles
   ```typescript
   /** Proof mode: Shows [description] */
   proof_my_proof?: boolean;
   ```

2. **Create drawing function** in `src/components/UnitCircle/canvas/proofs.ts`
   - Import `ProofContext` and helpers
   - Create function following existing patterns:
   ```typescript
   export function drawMyProof(c: ProofContext): void {
       const { ctx, origin, pCircle, pXAxis, cos, rad, theme, map } = c;
       
       // 1. Draw filled shape
       ctx.beginPath();
       ctx.fillStyle = withAlpha(theme.sin, OVERLAY_ALPHA.fill);
       // ... path operations
       ctx.fill();
       
       // 2. Draw lines
       drawLine(ctx, origin, pCircle, theme.sin, 4);
       
       // 3. Add labels
       drawText(ctx, "label", position, theme.text);
   }
   ```

3. **Call from renderer** in `src/components/UnitCircle/UnitCircleRenderer.ts`
   - Import the new function
   - Add conditional call in proof modes section:
   ```typescript
   if (toggles.proof_my_proof) {
       drawMyProof(proofCtx);
   }
   ```

4. **Add to lesson** (optional)
   - Update relevant lesson's `apply()` to enable the toggle
   - Or add new lesson for the proof

// turbo
5. **Verify build**
   ```bash
   npm run build
   ```

## Using ProofContext

The `ProofContext` object provides commonly needed values:

| Property | Type | Description |
|----------|------|-------------|
| `ctx` | CanvasRenderingContext2D | Canvas context |
| `origin` | Point | Origin point (0,0) in canvas coords |
| `pCircle` | Point | Point P on circle |
| `pXAxis` | Point | Point where vertical from P meets X-axis |
| `CX`, `CY` | number | Canvas center coordinates |
| `map` | Function | Maps unit coords to canvas coords |
| `rad`, `cos`, `sin`, `tan` | number | Current trig values |
| `theme` | TrigTheme | Color theme object |

## Color Guidelines

- Use `withAlpha(theme.color, OVERLAY_ALPHA.fill)` for filled shapes
- Use solid `theme.color` for lines and text
- Never hardcode RGBA values
