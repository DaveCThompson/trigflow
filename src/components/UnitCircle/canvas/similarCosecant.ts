import { drawLine } from './helpers';
import { ProofContext } from './proofs';
import { withAlpha, OVERLAY_ALPHA } from '../../../theme/overlays';

/**
 * Draws the Similar Triangle (Cosecant) visualization.
 * Shows the triangle O-P-C where C is on the y-axis (cosecant).
 * Simplified: Yellow triangle with right angle at P only.
 */
export function drawSimilarCosecant(c: ProofContext): void {
    const { ctx, origin, pCircle, map, csc, theme } = c;

    // Guard 
    if (Math.abs(c.sin) <= 0.001) return;

    const pCsc = map(0, csc);

    // Yellow triangle fill (O-P-C)
    ctx.beginPath();
    ctx.fillStyle = withAlpha(theme.csc, OVERLAY_ALPHA.medium);
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.lineTo(pCsc.x, pCsc.y);
    ctx.fill();

    // 1. Geometric Cotangent Line (P -> C)
    drawLine(ctx, pCircle, pCsc, theme.cot, 2, [6, 6]);

    // 2. Cosecant Line (O -> C)
    drawLine(ctx, origin, pCsc, theme.csc, 2, [6, 6]);

    // 3. Right Angle at P(cos, sin) - (Between Radius and Cotangent) - KEEP
    {
        // Vector P->O
        const dirToOX = origin.x - pCircle.x;
        const dirToOY = origin.y - pCircle.y;
        const lenO = Math.sqrt(dirToOX * dirToOX + dirToOY * dirToOY);
        const uOX = dirToOX / lenO;
        const uOY = dirToOY / lenO;

        // Vector P->C
        const dirToCX = pCsc.x - pCircle.x;
        const dirToCY = pCsc.y - pCircle.y;
        const lenC = Math.sqrt(dirToCX * dirToCX + dirToCY * dirToCY);
        const uCX = dirToCX / lenC;
        const uCY = dirToCY / lenC;

        const raSize = 10;
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;

        const c1 = { x: pCircle.x + uOX * raSize, y: pCircle.y + uOY * raSize };
        const c2 = { x: c1.x + uCX * raSize, y: c1.y + uCY * raSize };
        const c3 = { x: pCircle.x + uCX * raSize, y: pCircle.y + uCY * raSize };

        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.stroke();
    }
}
