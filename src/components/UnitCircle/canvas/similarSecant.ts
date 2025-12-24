import { drawLine, drawText } from './helpers';
import { ProofContext } from './proofs';

/**
 * Draws the Similar Triangle (Secant) visualization.
 * Shows the triangle O-P-S where S is on the x-axis (secant).
 * Includes the "Duplicate Triangle" (Complementary) visualization.
 */
export function drawSimilarSecant(c: ProofContext): void {
    const { ctx, origin, pCircle, pXAxis, pYAxis, map, rad, cos, sin, sec, theme } = c;

    // Guard against divide by zero / undefined secant
    if (Math.abs(cos) <= 0.001) return;

    const pSec = map(sec, 0);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(241, 196, 15, 0.1)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.lineTo(pSec.x, pSec.y);
    ctx.fill();

    // 1. Geometric Tangent Line (P -> S)
    // User requested: Dotted Orange
    drawLine(ctx, pCircle, pSec, theme.tan, 2, [6, 6]);

    // 2. Secant Line (O -> S)
    // User requested: Dotted Purple
    drawLine(ctx, origin, pSec, theme.sec, 2, [6, 6]);

    // --- Standard Triangle Visuals (Alpha & Right Angle) ---

    // 1. Right Angle at (cos, 0) for Standard Triangle
    // Point is pXAxis
    {
        const raSize = 10;
        const dirToOriginX = origin.x - pXAxis.x;
        const signX = dirToOriginX >= 0 ? 1 : -1;
        const dirToPY = pCircle.y - pXAxis.y;
        const signY = dirToPY >= 0 ? 1 : -1;

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.moveTo(pXAxis.x + signX * raSize, pXAxis.y);
        ctx.lineTo(pXAxis.x + signX * raSize, pXAxis.y + signY * raSize);
        ctx.lineTo(pXAxis.x, pXAxis.y + signY * raSize);
        ctx.stroke();
    }

    // 2. Alpha at P(cos, sin) - Top Right of Standard Triangle
    // Vertices: O, pXAxis, pCircle.
    {
        const alphaR = 20;
        const angVertical = Math.atan2(pXAxis.y - pCircle.y, pXAxis.x - pCircle.x);
        const angHypot = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.arc(pCircle.x, pCircle.y, alphaR, angVertical, angHypot, false);
        ctx.stroke();
        // Alpha Label
        const midAlpha = (angVertical + angHypot) / 2;
        drawText(ctx, "α", {
            x: pCircle.x + Math.cos(midAlpha) * 30,
            y: pCircle.y + Math.sin(midAlpha) * 30
        }, theme.text);
    }

    // 3. Right Angle at P(cos, sin) for Secant/Tangent Triangle
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
        // Square corners: P, P + uO*s, P + uO*s + uS*s, P + uS*s
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

    // --- Alpha Angle at S(sec, 0) ---
    // Between Secant Line (X-axis, towards Origin) and Tangent Line (towards P)
    {
        const pf = map(sec, 0); // S
        const vecToOrigin = { x: origin.x - pf.x, y: origin.y - pf.y };
        const angToOrigin = Math.atan2(vecToOrigin.y, vecToOrigin.x);
        const vecToP = { x: pCircle.x - pf.x, y: pCircle.y - pf.y };
        const angToP = Math.atan2(vecToP.y, vecToP.x);

        // Label Only - Position relative to vertex
        const midX = (Math.cos(angToOrigin) + Math.cos(angToP));
        const midY = (Math.sin(angToOrigin) + Math.sin(angToP));
        const angMid = Math.atan2(midY, midX);

        drawText(ctx, "α", {
            x: pf.x + Math.cos(angMid) * 35,
            y: pf.y + Math.sin(angMid) * 35
        }, theme.text);
    }

    // --- NEW: Theta Angle at P (Intersection of Tangent and Sine/Vertical) ---
    {
        const thetaR = 25;
        // Vector P->S (Tangent)
        const pS = map(sec, 0);
        const angTan = Math.atan2(pS.y - pCircle.y, pS.x - pCircle.x);

        // Vector P->A (Vertical/Sine) - towards X-axis
        const angVert = Math.atan2(pXAxis.y - pCircle.y, pXAxis.x - pCircle.x);

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.arc(pCircle.x, pCircle.y, thetaR, angTan, angVert, false);
        ctx.stroke();

        // Label
        const midTheta = (angTan + angVert) / 2;
        drawText(ctx, "θ", {
            x: pCircle.x + Math.cos(midTheta) * 35,
            y: pCircle.y + Math.sin(midTheta) * 35
        }, theme.text);
    }

    // --- NEW: Supplementary Right Angle at A (pXAxis) ---
    // Existing right angle is inside O-A-P. Add one on the other side (towards S).
    {
        const raSize = 10;
        const pSec = map(sec, 0);
        // Direction A->S (away from origin)
        const dirToSX = pSec.x - pXAxis.x;
        const signSX = dirToSX >= 0 ? 1 : -1;

        // Direction A->P (Vertical)
        const dirToPY = pCircle.y - pXAxis.y;
        const signPY = dirToPY >= 0 ? 1 : -1;

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.moveTo(pXAxis.x + signSX * raSize, pXAxis.y);
        ctx.lineTo(pXAxis.x + signSX * raSize, pXAxis.y + signPY * raSize);
        ctx.lineTo(pXAxis.x, pXAxis.y + signPY * raSize);
        ctx.stroke();
    }

    // --- NEW: Duplicate Triangle (Complementary) ---
    // 1. Dotted Horizontal Line (Duplicate Cosine)
    // From P(cos, sin) to Py(0, sin)
    drawLine(ctx, pCircle, pYAxis, theme.text, 1, [4, 4]);

    // 2. Dotted Vertical Line (Duplicate Sine)
    // From Origin(0,0) to Py(0, sin) - effectively the Y-axis segment
    drawLine(ctx, origin, pYAxis, theme.text, 1, [4, 4]);

    // 3. Right Angle at Py(0, sin)
    const raSize = 10;
    const dY = sin >= 0 ? -1 : 1; // Down towards origin if sin>0
    const dX = cos >= 0 ? 1 : -1; // Towards P

    ctx.beginPath();
    ctx.strokeStyle = theme.text;
    ctx.lineWidth = 1;
    ctx.moveTo(pYAxis.x + dX * raSize, pYAxis.y);
    ctx.lineTo(pYAxis.x + dX * raSize, pYAxis.y + dY * raSize);
    ctx.lineTo(pYAxis.x, pYAxis.y + dY * raSize);
    ctx.stroke();

    // 4. Alpha Angle at Origin (0,0)
    // Between Y-axis (PI/2) and Radius (rad)
    const alphaR = 20;
    ctx.beginPath();
    ctx.strokeStyle = theme.text;
    const angleCanvasRad = -rad; // Canvas Y is flipped. +rad means UP, which is -angle in canvas.
    const angleCanvasY = -Math.PI / 2; // Up
    ctx.arc(origin.x, origin.y, alphaR, angleCanvasY, angleCanvasRad, false);
    ctx.stroke();
    // Label alpha near origin
    const midAlpha = (angleCanvasY + angleCanvasRad) / 2;
    drawText(ctx, "α", {
        x: origin.x + Math.cos(midAlpha) * 35,
        y: origin.y + Math.sin(midAlpha) * 35
    }, theme.text);


    // 5. Theta Angle at P(cos, sin)
    const thetaR = 20;
    const angPO = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);
    const angPPy = Math.atan2(pYAxis.y - pCircle.y, pYAxis.x - pCircle.x);

    ctx.beginPath();
    ctx.strokeStyle = theme.text;
    ctx.arc(pCircle.x, pCircle.y, thetaR, angPPy, angPO, rad > 0);
    ctx.stroke();

    // Label Theta
    const midTheta2 = (angPO + angPPy) / 2;
    drawText(ctx, "θ", {
        x: pCircle.x + Math.cos(midTheta2) * 35,
        y: pCircle.y + Math.sin(midTheta2) * 35
    }, theme.text);
}
