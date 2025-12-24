import { drawLine, drawText } from './helpers';
import { ProofContext } from './proofs';
import { withAlpha, OVERLAY_ALPHA } from '../../../theme/overlays';

/**
 * Draws the Similar Triangle (Cosecant) visualization.
 * Shows the triangle O-P-C where C is on the y-axis (cosecant).
 */
export function drawSimilarCosecant(c: ProofContext): void {
    const { ctx, origin, pCircle, pYAxis, map, csc, theme } = c;

    // Guard 
    if (Math.abs(c.sin) <= 0.001) return;

    const pCsc = map(0, csc);

    ctx.beginPath();
    ctx.fillStyle = withAlpha(theme.csc, OVERLAY_ALPHA.medium);
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.lineTo(pCsc.x, pCsc.y);
    ctx.fill();

    // 1. Geometric Cotangent Line (P -> C)
    // User requested: Dotted Green
    drawLine(ctx, pCircle, pCsc, theme.cot, 2, [6, 6]);

    // 2. Cosecant Line (O -> C)
    // User requested: Dotted Yellow/Gold
    drawLine(ctx, origin, pCsc, theme.csc, 2, [6, 6]);

    // --- Angles & Details ---
    // Right Angle at P(cos, sin) - (Between Radius and Cotangent)
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

    // --- NEW: Theta at P (Intersection of Cotangent and Cosine/Horizontal) ---
    {
        const thetaR = 25;
        // Vector P->C (Cotangent)
        const angCot = Math.atan2(pCsc.y - pCircle.y, pCsc.x - pCircle.x);
        // Vector P->Py (Horizontal/Cosine line to Y-axis)
        const angHoriz = Math.atan2(pYAxis.y - pCircle.y, pYAxis.x - pCircle.x);

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.arc(pCircle.x, pCircle.y, thetaR, angHoriz, angCot, false);
        ctx.stroke();

        // Label
        const midTheta = (angHoriz + angCot) / 2;
        drawText(ctx, "θ", { x: pCircle.x + Math.cos(midTheta) * 35, y: pCircle.y + Math.sin(midTheta) * 35 }, theme.label_primary, "center", "middle", theme.halo);
    }

    // --- Theta Label at C (0, csc) - Remove Arc, Keep Label ---
    {
        // Just label
        drawText(ctx, "θ", { x: pCsc.x + 10, y: pCsc.y + (csc > 0 ? 35 : -35) }, theme.label_primary, "center", "middle", theme.halo);
    }

    // --- NEW: Supplementary Right Angle at Py (pYAxis) ---
    {
        const raSize = 10;
        // Direction Py->C (away from origin along Y)
        const dirToCY = pCsc.y - pYAxis.y;
        const signCY = dirToCY >= 0 ? 1 : -1;

        // Direction Py->P (Horizontal)
        const dirToPX = pCircle.x - pYAxis.x;
        const signPX = dirToPX >= 0 ? 1 : -1;

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.moveTo(pYAxis.x + signPX * raSize, pYAxis.y);
        ctx.lineTo(pYAxis.x + signPX * raSize, pYAxis.y + signCY * raSize);
        ctx.lineTo(pYAxis.x, pYAxis.y + signCY * raSize);
        ctx.stroke();
    }
}
