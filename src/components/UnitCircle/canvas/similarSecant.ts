import { drawLine, drawText } from './helpers';
import { ProofContext } from './proofs';
import { withAlpha, OVERLAY_ALPHA } from '../../../theme/overlays';

/**
 * Draws the Similar Triangle (Secant) visualization.
 * Shows the triangle O-P-S where S is on the x-axis (secant).
 * Simplified: Shows purple triangle with alpha labels at S and Origin.
 */
export function drawSimilarSecant(c: ProofContext): void {
    const { ctx, origin, pCircle, map, rad, cos, sec, theme } = c;

    // Guard against divide by zero / undefined secant
    if (Math.abs(cos) <= 0.001) return;

    const pSec = map(sec, 0);

    // Purple triangle fill (O-P-S)
    ctx.beginPath();
    ctx.fillStyle = withAlpha(theme.sec, OVERLAY_ALPHA.medium);
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.lineTo(pSec.x, pSec.y);
    ctx.fill();

    // 1. Geometric Tangent Line (P -> S)
    drawLine(ctx, pCircle, pSec, theme.tan, 2, [6, 6]);

    // 2. Secant Line (O -> S)
    drawLine(ctx, origin, pSec, theme.sec, 2, [6, 6]);

    // 3. Right Angle at P(cos, sin) for Secant/Tangent Triangle (KEEP)
    {
        // Vector P->O
        const dirToOX = origin.x - pCircle.x;
        const dirToOY = origin.y - pCircle.y;
        const lenO = Math.sqrt(dirToOX * dirToOX + dirToOY * dirToOY);
        const uOX = dirToOX / lenO;
        const uOY = dirToOY / lenO;

        // Vector P->Psec
        const dirToSecX = pSec.x - pCircle.x;
        const dirToSecY = pSec.y - pCircle.y;
        const lenS = Math.sqrt(dirToSecX * dirToSecX + dirToSecY * dirToSecY);
        const uSX = dirToSecX / lenS;
        const uSY = dirToSecY / lenS;

        const raSize = 10;
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;

        const c1 = { x: pCircle.x + uOX * raSize, y: pCircle.y + uOY * raSize };
        const c2 = { x: c1.x + uSX * raSize, y: c1.y + uSY * raSize };
        const c3 = { x: pCircle.x + uSX * raSize, y: pCircle.y + uSY * raSize };

        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.stroke();
    }

    // 4. Alpha Angle label at S(sec, 0) (KEEP)
    {
        const pf = map(sec, 0); // S
        const vecToOrigin = { x: origin.x - pf.x, y: origin.y - pf.y };
        const angToOrigin = Math.atan2(vecToOrigin.y, vecToOrigin.x);
        const vecToP = { x: pCircle.x - pf.x, y: pCircle.y - pf.y };
        const angToP = Math.atan2(vecToP.y, vecToP.x);

        const midX = (Math.cos(angToOrigin) + Math.cos(angToP));
        const midY = (Math.sin(angToOrigin) + Math.sin(angToP));
        const angMid = Math.atan2(midY, midX);

        drawText(ctx, "α", {
            x: pf.x + Math.cos(angMid) * 35,
            y: pf.y + Math.sin(angMid) * 35
        }, theme.label_primary, "center", "middle", theme.halo);
    }

    // 5. Alpha Angle at Origin (0,0) (KEEP)
    // Between Y-axis (PI/2) and Radius (rad)
    {
        const alphaR = 20;
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        const angleCanvasRad = -rad; // Canvas Y is flipped
        const angleCanvasY = -Math.PI / 2; // Up
        ctx.arc(origin.x, origin.y, alphaR, angleCanvasY, angleCanvasRad, false);
        ctx.stroke();
        // Label alpha near origin
        const midAlpha = (angleCanvasY + angleCanvasRad) / 2;
        drawText(ctx, "α", {
            x: origin.x + Math.cos(midAlpha) * 35,
            y: origin.y + Math.sin(midAlpha) * 35
        }, theme.text, "center", "middle", theme.halo);
    }
}

