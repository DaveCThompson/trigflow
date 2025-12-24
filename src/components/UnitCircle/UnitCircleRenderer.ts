import { toRad, createCoordinateMapper } from '../../utils/math';
import { UnitCircleState } from '../../types';
import { drawLine, drawText, drawPoint, drawQuadrants } from './canvas/helpers';
import {
    ProofContext,
    drawSineTriangleProof,
    drawTangentTriangleProof,
    drawGeneralFormUnitProof,
    drawGeneralFormTargetProof,
    drawPythagoreanSquaresProof,
    drawPythagoreanGeneralProof
} from './canvas/proofs';
import { drawSimilarSecant } from './canvas/similarSecant';
import { drawSimilarCosecant } from './canvas/similarCosecant';

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

    // Create ProofContext early for use in all sub-renderers
    const proofCtx: ProofContext = {
        ctx, origin, pCircle, pXAxis, pYAxis, CX, CY, map, rad, cos, sin, tan, sec, csc, cot, theme
    };

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
    if (toggles.similarSec) {
        drawSimilarSecant(proofCtx);
    }

    // --- Feature: Similar Triangle (Cosecant: O-P-C) ---
    // Vertices: Origin(0,0), P(cos, sin), C(0, csc)
    if (toggles.similarCsc) {
        drawSimilarCosecant(proofCtx);
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
        if (toggles.cosOnCompSide) {
            // Complementary position: cos is the horizontal segment from P to Y-axis
            // This visualizes cos(θ) = sin(90°-θ) relationship
            drawLine(ctx, pCircle, pYAxis, theme.cos, 4);
            const labelX = pYAxis.x - 15;
            const labelY = (pYAxis.y + pCircle.y) / 2;
            drawText(ctx, "cos", { x: labelX, y: labelY }, theme.cos, "right");
        } else {
            // Standard position: cos is the horizontal segment from O to (cos, 0)
            drawLine(ctx, origin, pXAxis, theme.cos, 4);
            drawText(ctx, "cos", { x: (CX + pXAxis.x) / 2, y: CY + 15 }, theme.cos);
        }
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

    // --- Proof Modes (using extracted functions) ---

    if (toggles.proof_sin_tri) {
        drawSineTriangleProof(proofCtx);
    }

    if (toggles.proof_tan_tri) {
        drawTangentTriangleProof(proofCtx);
    }

    if (toggles.proof_general_unit) {
        drawGeneralFormUnitProof(proofCtx);
    }

    if (toggles.proof_general_target) {
        drawGeneralFormTargetProof(proofCtx);
    }

    if (toggles.proof_pythag_squares) {
        drawPythagoreanSquaresProof(proofCtx);
    }

    if (toggles.proof_pythag_general) {
        drawPythagoreanGeneralProof(proofCtx);
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
