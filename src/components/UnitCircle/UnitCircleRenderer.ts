import { toRad, createCoordinateMapper } from '../../utils/math';
import { UnitCircleState } from '../../types';
import { drawLine, drawText, drawPoint, drawQuadrants } from './canvas/helpers';

// Re-export for consumers that import from this file
export type { UnitCircleState } from '../../types';

export const drawUnitCircle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: UnitCircleState
) => {
    const { angle, angleUnit, toggles, theme } = state;

    // Setup
    const W = width;
    const H = height;
    const CX = W / 2;
    const CY = H / 2;

    // Radius allows for some padding
    // Scaled down relative to canvas to show more graph area (1.5x zoom out equivalent)
    const R = Math.min(W, H) / 4.2;

    const map = createCoordinateMapper(CX, CY, R);
    const origin = map(0, 0);

    // Clear
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    // --- 0. Background Quadrants ---
    if (toggles.quadrants) {
        drawQuadrants(ctx, W, H, theme);
    }


    // Calc Trig Values
    const rad = toRad(angle);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tan = Math.tan(rad);
    const cot = 1 / tan;
    const sec = 1 / cos;
    const csc = 1 / sin;

    const pCircle = map(cos, sin);
    const pXAxis = map(cos, 0);
    const pYAxis = map(0, sin);

    // --- 1. Axes & Grid ---
    drawLine(ctx, { x: 0, y: CY }, { x: W, y: CY }, theme.grid, 1);
    drawLine(ctx, { x: CX, y: 0 }, { x: CX, y: H }, theme.grid, 1);

    // --- 2. Circle ---
    ctx.beginPath();
    ctx.strokeStyle = theme.axis;
    ctx.lineWidth = 2;
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.stroke();

    // --- 3. Angle Wedge ---
    ctx.beginPath();
    ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, 50, 0, -rad, true);
    ctx.lineTo(CX, CY);
    ctx.fill();

    const mid = rad / 2;
    const angleText = angleUnit === 'rad'
        ? (rad / Math.PI).toFixed(2) + 'π'
        : 'θ';
    drawText(ctx, angleText, map(Math.cos(mid) * 0.25, Math.sin(mid) * 0.25), theme.text);

    // --- 4. Radius (Hypotenuse) ---
    // --- 4. Radius (Hypotenuse) ---
    if (toggles.hypotenuse) {
        drawLine(ctx, origin, pCircle, theme.axis, 2);
        // Label the radius as 1
        // Fix: Use 'rad' (line angle) instead of 'mid' (wedge bisector) so it tracks the line.
        // Place at 50% distance.
        const rLabelPos = map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5);
        // Slight offset for readability? The halo handles it, but let's push it slightly "above" the line relative to rotation
        // Actually, centering it on the line is standard for "length" labels if they have a background/halo.
        drawText(ctx, "1", rLabelPos, theme.text);
    } else {
        // Default visuals when toggles are off: Dotted Radius to show connection
        drawLine(ctx, origin, pCircle, theme.axis, 1, [4, 4]);
    }

    // --- Feature: Similar Triangle (Secant) for GEOMETRY Mode ---
    if (toggles.similarSec && Math.abs(cos) > 0.001) {
        // ... previous logic for similar triangles ...
        // Note: You might want to respect 'theta' and 'alpha' request even if this toggle is off, 
        // but user asked for "Secant Triangle" labels in context of that feature.
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
        // Added here as part of "Similar Triangles" context, or could be global?
        // User asked for "When the similar triangle is on... initial triangle should show alpha"

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

            // REMOVED ARC
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
        const midTheta = (angPO + angPPy) / 2;
        drawText(ctx, "θ", {
            x: pCircle.x + Math.cos(midTheta) * 35,
            y: pCircle.y + Math.sin(midTheta) * 35
        }, theme.text);

    }

    // --- Feature: Similar Triangle (Cosecant: O-P-C) ---
    // Vertices: Origin(0,0), P(cos, sin), C(0, csc)
    if (toggles.similarCsc && Math.abs(sin) > 0.001) {
        const pCsc = map(0, csc);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(230, 126, 34, 0.1)'; // Cosecant Triangle fill
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
            drawText(ctx, "θ", { x: pCircle.x + Math.cos(midTheta) * 35, y: pCircle.y + Math.sin(midTheta) * 35 }, theme.text);
        }

        // --- Theta Label at C (0, csc) - Remove Arc, Keep Label ---
        {
            // Just label
            drawText(ctx, "θ", { x: pCsc.x + 10, y: pCsc.y + (csc > 0 ? 35 : -35) }, theme.text);
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

    // --- Feature: Geometric Tangent (P -> Sec) ---
    if (toggles.geoTan) {
        const pSec = map(sec, 0); // X-axis intercept
        // 1. Tangent Segment (P -> X-axis intercept)
        // Dotted Orange (Tan color)
        drawLine(ctx, pCircle, pSec, theme.tan, 2, [6, 6]);
    }

    // --- Feature: Geometric Cotangent (P -> Csc) ---
    if (toggles.geoCot) {
        const pCsc = map(0, csc); // Y-axis intercept
        // 2. Cotangent Segment (P -> Y-axis intercept)
        // Dotted Green (Cot color)
        drawLine(ctx, pCircle, pCsc, theme.cot, 2, [6, 6]);
    }

    // --- Separate Sin/Cos ---
    if (toggles.cos) {
        drawLine(ctx, origin, pXAxis, theme.cos, 4);
        drawText(ctx, "cos", { x: (CX + pXAxis.x) / 2, y: CY + 15 }, theme.cos);
    }

    if (toggles.sin) {
        drawLine(ctx, pXAxis, pCircle, theme.sin, 4);
        drawText(ctx, "sin", { x: pXAxis.x + (cos >= 0 ? 15 : -15), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right");
    }

    // --- Tan (x=1) ---
    if (toggles.tan) {
        const dir = cos >= 0 ? 1 : -1;
        const pStart = map(dir, 0);
        const pEnd = map(dir, dir * tan);

        drawLine(ctx, origin, pEnd, theme.grid, 1, [5, 5]);
        drawLine(ctx, pStart, pEnd, theme.tan, 4);
        drawPoint(ctx, pEnd, theme.tan, theme.bg);
        drawText(ctx, "tan", { x: pStart.x + dir * 20, y: (pStart.y + pEnd.y) / 2 }, theme.tan, dir > 0 ? "left" : "right");
    }

    // --- Cot (y=1) ---
    if (toggles.cot) {
        const dir = sin >= 0 ? 1 : -1;
        const pStart = map(0, dir);
        const pEnd = map(dir * cot, dir);

        drawLine(ctx, origin, pEnd, theme.grid, 1, [5, 5]);
        drawLine(ctx, pStart, pEnd, theme.cot, 4);
        drawPoint(ctx, pEnd, theme.cot, theme.bg);
        drawText(ctx, "cot", { x: (pStart.x + pEnd.x) / 2, y: pStart.y - dir * 15 }, theme.cot, "center", dir > 0 ? "bottom" : "top");
    }

    // --- Secant ---
    if (toggles.sec) {
        // sec is the hypotenuse from origin to (sec, 0) on x-axis
        const pSec = map(sec, 0);
        drawLine(ctx, origin, pSec, theme.sec, 4);
        drawText(ctx, "sec", { x: (CX + pSec.x) / 2, y: CY + 25 }, theme.sec);
        drawPoint(ctx, pSec, theme.sec, theme.bg);
    }

    // --- Cosecant ---
    if (toggles.csc) {
        // csc is hypotenuse from origin to (0, csc) on y-axis
        const pCsc = map(0, csc);
        drawLine(ctx, origin, pCsc, theme.csc, 4);
        drawText(ctx, "csc", { x: CX + 15, y: (CY + pCsc.y) / 2 }, theme.csc);
        drawPoint(ctx, pCsc, theme.csc, theme.bg);
    }

    // --- Complementary Angle ---
    if (toggles.comp) {
        // Arc
        ctx.beginPath();
        ctx.strokeStyle = theme.comp;
        ctx.lineWidth = 1;
        ctx.arc(CX, CY, 70, -Math.PI / 2, -rad, cos < 0);
        ctx.stroke();

        const compMid = (rad + Math.PI / 2) / 2;
        // Updated Label: Just alpha
        drawText(ctx, "α", map(Math.cos(compMid) * 0.45, Math.sin(compMid) * 0.45), theme.comp);

        // --- Alpha at P (Interior Angle) ---
        // Between Vertical (Sine line) and Radius (Hypotenuse)
        {
            const alphaR = 20;
            // Vector P->O (Radius)
            const angToO = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);
            // Vector Vertical Down (Parallel to Y-axis / Sine line)
            const angToVert = Math.atan2(pXAxis.y - pCircle.y, pXAxis.x - pCircle.x);

            ctx.beginPath();
            ctx.strokeStyle = theme.comp;
            ctx.lineWidth = 1;
            ctx.arc(pCircle.x, pCircle.y, alphaR, angToVert, angToO, false);
            ctx.stroke();

            // Label
            const midAlpha2 = (angToVert + angToO) / 2;
            drawText(ctx, "α", {
                x: pCircle.x + Math.cos(midAlpha2) * 35,
                y: pCircle.y + Math.sin(midAlpha2) * 35
            }, theme.comp);
        }
    }

    // --- Proof Mode: Sine Triangle ---
    if (toggles.proof_sin_tri) {
        ctx.beginPath();
        // Fill mix of Red(sin) and Blue(cos) -> Purple-ish
        ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pXAxis.x, pXAxis.y); // (cos, 0)
        ctx.lineTo(pCircle.x, pCircle.y); // (cos, sin)
        ctx.closePath();
        ctx.fill();

        // Outline specific sides
        // Adjacent (Cos) - Blue
        drawLine(ctx, origin, pXAxis, theme.cos, 4);
        // Opposite (Sin) - Red
        drawLine(ctx, pXAxis, pCircle, theme.sin, 4);
        // Hypotenuse (1) - Axis/White
        drawLine(ctx, origin, pCircle, theme.text, 2);

        // Labels
        drawText(ctx, "1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
        drawText(ctx, "cos", { x: (CX + pXAxis.x) / 2, y: CY + 15 }, theme.cos);
        drawText(ctx, "sin", { x: pXAxis.x + (cos >= 0 ? 15 : -15), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right");
    }

    // --- Proof Mode: Tangent Triangle ---
    if (toggles.proof_tan_tri) {
        const dir = cos >= 0 ? 1 : -1;
        const pStart = map(dir, 0); // (1, 0)
        const pEnd = map(dir, dir * tan); // (1, tan)

        ctx.beginPath();
        // Fill Orange
        ctx.fillStyle = 'rgba(230, 126, 34, 0.2)';
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.closePath();
        ctx.fill();

        // Outline specific sides
        // Adjacent (1) - Axis/White. Slightly offset or just redraw?
        // Since it's on axis, we can just draw it solid.
        drawLine(ctx, origin, pStart, theme.text, 3);

        // Opposite (Tan) - Orange
        drawLine(ctx, pStart, pEnd, theme.tan, 4);

        // Hypotenuse (Sec) - Dashed or different style
        drawLine(ctx, origin, pEnd, theme.text, 2, [6, 4]);

        // Labels
        drawText(ctx, "1", { x: (origin.x + pStart.x) / 2, y: CY + 20 }, theme.text);
        drawText(ctx, "tan", { x: pStart.x + dir * 20, y: (pStart.y + pEnd.y) / 2 }, theme.tan, dir > 0 ? "left" : "right");
    }

    // --- Proof Mode: General Form ---
    if (toggles.proof_general_unit) {
        // Just the standard unit triangle, but labeled specifically for this proof
        ctx.beginPath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; // Blue fill
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pXAxis.x, pXAxis.y);
        ctx.lineTo(pCircle.x, pCircle.y);
        ctx.closePath();
        ctx.fill();

        drawLine(ctx, origin, pXAxis, theme.text, 2); // Adj
        drawLine(ctx, pXAxis, pCircle, theme.sin, 3); // Opp (Sin)
        drawLine(ctx, origin, pCircle, theme.text, 2); // Hyp (1)

        drawText(ctx, "sin θ", { x: pXAxis.x + (cos >= 0 ? 20 : -20), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right");
        drawText(ctx, "1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
    }

    if (toggles.proof_general_target) {
        // Draw a larger scaled triangle behind/around to show similarity
        // Let's interpret the unit circle as the "small" triangle inside a larger concept
        // Or actually, draw a separate triangle offset? No, overlay is usually better for similarity.
        // Let's scale up by 1.5x
        const scale = 1.35;
        const pGenEnd = map(Math.cos(rad) * scale, Math.sin(rad) * scale);
        const pGenAxis = { x: pGenEnd.x, y: origin.y };

        ctx.beginPath();
        // Dashed lines for the projection
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pGenEnd.x, pGenEnd.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // The Triangle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; // Greenish
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pGenAxis.x, pGenAxis.y);
        ctx.lineTo(pGenEnd.x, pGenEnd.y);
        ctx.closePath();
        ctx.fill();

        drawLine(ctx, origin, pGenAxis, theme.text, 2); // Adj
        drawLine(ctx, pGenAxis, pGenEnd, theme.tan, 3); // Opp 
        drawLine(ctx, origin, pGenEnd, theme.text, 2); // Hyp

        drawText(ctx, "H", map(Math.cos(rad) * scale * 0.55, Math.sin(rad) * scale * 0.55), theme.text);
        drawText(ctx, "O", { x: pGenAxis.x + (cos >= 0 ? 15 : -15), y: (pGenAxis.y + pGenEnd.y) / 2 }, theme.tan, cos >= 0 ? "left" : "right");
        drawText(ctx, "A", { x: (origin.x + pGenAxis.x) / 2, y: origin.y + 15 }, theme.text);
    }

    // --- Proof Mode: Pythagorean Squares ---
    if (toggles.proof_pythag_squares) {
        // Draw squares on the sides of the sine triangle

        // 1. Square on Adjacent (Cos) - Blue
        const cosSize = Math.abs(pXAxis.x - origin.x); // width
        // Draw square below x-axis
        ctx.beginPath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fillRect(Math.min(origin.x, pXAxis.x), origin.y, cosSize, cosSize); // Below axis

        // 2. Square on Sine (Red)
        // Draw square to the right of the vertical line
        const sinSize = Math.abs(pCircle.y - pXAxis.y);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        // If cos is positive, draw to right. If negative, left.
        const dir = cos >= 0 ? 1 : -1;
        ctx.fillRect(pXAxis.x, Math.min(pXAxis.y, pCircle.y), sinSize * dir, sinSize);

        // Labels
        if (cosSize > 10) drawText(ctx, "a²", { x: (origin.x + pXAxis.x) / 2, y: origin.y + cosSize / 2 }, theme.cos);
        if (sinSize > 10) drawText(ctx, "b²", { x: pXAxis.x + (sinSize * dir) / 2, y: (pXAxis.y + pCircle.y) / 2 }, theme.sin);

        // Square on Hypotenuse (c=1)
        drawText(ctx, "c² = 1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
    }

    // --- Proof Mode: General Pythagorean Theorem ---
    if (toggles.proof_pythag_general) {
        // Draw a generic right triangle with squares on all sides
        // We'll place this somewhat centrally or use the unit circle triangle but labeled generically a, b, c

        // Let's use the standard "Sine" triangle but label it a, b, c
        // And draw squares on all sides, including hypotenuse!

        // 1. Triangle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(pXAxis.x, pXAxis.y);
        ctx.lineTo(pCircle.x, pCircle.y);
        ctx.closePath();
        ctx.fill();

        // 2. Squares

        // Square on Adjacent (a)
        const aSize = Math.abs(pXAxis.x - origin.x);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Blueish
        ctx.fillRect(Math.min(origin.x, pXAxis.x), origin.y, aSize, aSize);
        drawText(ctx, "a²", { x: (origin.x + pXAxis.x) / 2, y: origin.y + aSize / 2 }, theme.text);

        // Square on Opposite (b)
        const bSize = Math.abs(pCircle.y - pXAxis.y);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Reddish
        const dir = cos >= 0 ? 1 : -1;
        ctx.fillRect(pXAxis.x, Math.min(pXAxis.y, pCircle.y), bSize * dir, bSize);
        drawText(ctx, "b²", { x: pXAxis.x + (bSize * dir) / 2, y: (pXAxis.y + pCircle.y) / 2 }, theme.text);

        // Square on Hypotenuse (c) - This is the tricky one to draw rotationally aligned
        // We need 4 points. P1(origin), P2(pCircle). 
        // Vector V = P2 - P1. 
        // Normal N = (-Vy, Vx).
        // P3 = P2 + N. P4 = P1 + N.

        const P1 = origin;
        const P2 = pCircle;
        const dx = P2.x - P1.x;
        const dy = P2.y - P1.y;

        // We want the square to go "outwards" away from the center/triangle usually.
        // For the triangle O-A-P (Origin, Axis, Point), the hypotenuse is O-P.
        // If we go "up/left" for Q1, it might overlap the circle heavily.
        // Let's try to project it "outward".
        // Current angle is 'rad'. Normal is rad + 90deg?

        // Let's just calculate raw vector
        const len = Math.sqrt(dx * dx + dy * dy);
        // Unit normal
        const nx = -dy / len;
        const ny = dx / len;

        // Direction? If we are in Q1 (dx>0, dy<0 in canvas?), 
        // Normal (-(-), +) -> (+, +). This points down/right? No, visual space.
        // Let's just try one direction and flip if needed. usually "up" in diagram means -y.
        // If we want it "outside" the triangle (which is "below" the hypotenuse in Q1 visual?), 
        // let's try subtracting the normal.

        const scale = len; // Square side length is length of hypotenuse

        const P3 = { x: P2.x - nx * scale, y: P2.y - ny * scale };
        const P4 = { x: P1.x - nx * scale, y: P1.y - ny * scale };

        ctx.beginPath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'; // Greenish
        ctx.moveTo(P1.x, P1.y);
        ctx.lineTo(P2.x, P2.y);
        ctx.lineTo(P3.x, P3.y);
        ctx.lineTo(P4.x, P4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.stroke();

        drawText(ctx, "c²", { x: (P1.x + P3.x) / 2, y: (P1.y + P3.y) / 2 }, theme.text);

        // Labels on sides
        drawText(ctx, "a", { x: (origin.x + pXAxis.x) / 2, y: origin.y - 10 }, theme.text); // Above/Below axis?
        drawText(ctx, "b", { x: pXAxis.x + (dir * 10), y: (pXAxis.y + pCircle.y) / 2 }, theme.text);
        drawText(ctx, "c", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
    }

    // --- Axes Intersection Points ---
    if (toggles.axesIntersections) {
        const intersections = [
            { p: map(1, 0), label: '(1, 0)' },
            { p: map(-1, 0), label: '(-1, 0)' },
            { p: map(0, 1), label: '(0, 1)' },
            { p: map(0, -1), label: '(0, -1)' },
        ];
        for (const { p, label } of intersections) {
            // Draw a small point
            ctx.beginPath();
            ctx.fillStyle = theme.text;
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = theme.bg;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Label offset based on position
            const offsetX = p.x > CX ? 12 : (p.x < CX ? -12 : 0);
            const offsetY = p.y > CY ? 15 : (p.y < CY ? -15 : 0);
            const align: CanvasTextAlign = p.x > CX ? 'left' : (p.x < CX ? 'right' : 'center');
            drawText(ctx, label, { x: p.x + offsetX, y: p.y + offsetY }, theme.text, align);
        }
    }

    // --- Show X,Y Coordinates ---
    if (toggles.showXY) {
        const xVal = cos.toFixed(2);
        const yVal = sin.toFixed(2);
        const label = `(${xVal}, ${yVal})`;
        // Offset label based on quadrant to avoid overlap with point
        const offsetX = cos >= 0 ? 15 : -15;
        const offsetY = sin >= 0 ? -20 : 20;
        drawText(ctx, label, { x: pCircle.x + offsetX, y: pCircle.y + offsetY }, theme.text, cos >= 0 ? 'left' : 'right');
    }

    // Draw point P if we are not in pure abstraction mode, but maybe skip for clarity
    if (!toggles.proof_general_target && !toggles.proof_tan_tri) {
        drawPoint(ctx, pCircle, theme.text, theme.bg);
    }
};
