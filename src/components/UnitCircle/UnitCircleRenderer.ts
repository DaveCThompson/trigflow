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

// Canvas sizing and positioning constants
const CIRCLE_PADDING_RATIO = 4.2;  // Provides space for labels outside circle
const WEDGE_RADIUS = 50;             // Angle indicator arc size
const COMPLEMENTARY_ARC_RADIUS = 70; // Complementary angle arc size
const COS_LABEL_OFFSET = 20;         // Distance from cos line to label
const SIN_LABEL_OFFSET = 20;         // Distance from sin line to label
const TAN_LABEL_OFFSET = 25;         // Distance from tan line to label
const SEC_LABEL_OFFSET = 30;         // Distance from sec point to label
const CSC_LABEL_OFFSET = 20;         // Distance from csc point to label
const COT_LABEL_OFFSET = 20;         // Distance from cot point to label
const ALPHA_INDICATOR_RADIUS = 20;   // Small angle indicator at point
const ALPHA_LABEL_OFFSET = 35;       // Distance from angle arc to label

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

    // Radius
    const R = Math.min(W, H) / CIRCLE_PADDING_RATIO;

    const map = createCoordinateMapper(CX, CY, R);
    const origin = map(0, 0);

    // Clear (Transparent)
    // We rely on the parent CSS 'bg-canvas-gradient' to show through
    ctx.clearRect(0, 0, W, H);

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
    // Make grid subtle
    drawLine(ctx, { x: 0, y: CY }, { x: W, y: CY }, theme.grid, 1.5);
    drawLine(ctx, { x: CX, y: 0 }, { x: CX, y: H }, theme.grid, 1.5);

    // Create ProofContext early for use in all sub-renderers
    const proofCtx: ProofContext = {
        ctx, origin, pCircle, pXAxis, pYAxis, CX, CY, map, rad, cos, sin, tan, sec, csc, cot, theme
    };

    // --- 2. Circle ---
    ctx.beginPath();
    ctx.strokeStyle = theme.axis;
    ctx.lineWidth = 2.5; // Thicker main circle
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.stroke();

    // --- 3. Angle Wedge ---
    // Use theme.fill_angle_wedge for consistent theming
    ctx.beginPath();
    ctx.fillStyle = theme.fill_angle_wedge;
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, WEDGE_RADIUS, 0, -rad, true);
    ctx.lineTo(CX, CY);
    ctx.fill();

    const mid = rad / 2;
    const angleText = angleUnit === 'rad'
        ? (rad / Math.PI).toFixed(2) + 'π'
        : 'θ';
    // LABEL VISIBILITY FIX
    // Use semantic tokens from architecture
    drawText(ctx, angleText, map(Math.cos(mid) * 0.25, Math.sin(mid) * 0.25), theme.label_on_fill, "center", "middle", theme.halo);

    // --- Feature: Similar Triangle (Secant) for GEOMETRY Mode ---
    if (toggles.similarSec) {
        drawSimilarSecant(proofCtx);
    }

    // --- Feature: Similar Triangle (Cosecant: O-P-C) ---
    if (toggles.similarCsc) {
        drawSimilarCosecant(proofCtx);
    }

    // --- Feature: Geometric Tangent (P -> Sec) ---
    if (toggles.geoTan) {
        const pSec = map(sec, 0); // X-axis intercept
        drawLine(ctx, pCircle, pSec, theme.tan, 2.5, [6, 6]);
    }

    // --- Feature: Geometric Cotangent (P -> Csc) ---
    if (toggles.geoCot) {
        const pCsc = map(0, csc); // Y-axis intercept
        drawLine(ctx, pCircle, pCsc, theme.cot, 2.5, [6, 6]);
    }

    // --- 4. Radius (Hypotenuse) - Drawn AFTER similar triangles so it's on top ---
    if (toggles.hypotenuse) {
        drawLine(ctx, origin, pCircle, theme.axis, 2.5);
        const rLabelPos = map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5);
        drawText(ctx, "1", rLabelPos, theme.label_primary, "center", "middle", theme.halo);
    } else {
        drawLine(ctx, origin, pCircle, theme.axis, 1.5, [4, 6]);
    }

    // --- Cosine (Always Complementary Position) ---
    if (toggles.cos) {
        drawLine(ctx, pCircle, pYAxis, theme.cos, 4);
        const labelX = pYAxis.x - COS_LABEL_OFFSET;
        const labelY = (pYAxis.y + pCircle.y) / 2;
        drawText(ctx, "cos", { x: labelX, y: labelY }, theme.cos, "right", "middle", theme.halo);
    }

    if (toggles.sin) {
        drawLine(ctx, pXAxis, pCircle, theme.sin, 4);
        drawText(ctx, "sin", { x: pXAxis.x + (cos >= 0 ? SIN_LABEL_OFFSET : -SIN_LABEL_OFFSET), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right", "middle", theme.halo);
    }

    // --- Tan (x=1) ---
    if (toggles.tan) {
        const dir = cos >= 0 ? 1 : -1;
        const pStart = map(dir, 0);
        const pEnd = map(dir, dir * tan);

        drawLine(ctx, origin, pEnd, theme.grid, 2, [5, 5]);
        drawLine(ctx, pStart, pEnd, theme.tan, 4);
        drawPoint(ctx, pEnd, theme.tan, theme.canvas_dot_bg);
        drawText(ctx, "tan", { x: pStart.x + dir * TAN_LABEL_OFFSET, y: (pStart.y + pEnd.y) / 2 }, theme.tan, dir > 0 ? "left" : "right", "middle", theme.halo);
    }

    // --- Cot (y=1) ---
    if (toggles.cot) {
        const dir = sin >= 0 ? 1 : -1;
        const pStart = map(0, dir);
        const pEnd = map(dir * cot, dir);

        drawLine(ctx, origin, pEnd, theme.grid, 2, [5, 5]);
        drawLine(ctx, pStart, pEnd, theme.cot, 4);
        drawPoint(ctx, pEnd, theme.cot, theme.canvas_dot_bg);
        drawText(ctx, "cot", { x: (pStart.x + pEnd.x) / 2, y: pStart.y - dir * COT_LABEL_OFFSET }, theme.cot, "center", dir > 0 ? "bottom" : "top", theme.halo);
    }

    // --- Secant ---
    if (toggles.sec) {
        const pSec = map(sec, 0);
        drawLine(ctx, origin, pSec, theme.sec, 4);
        drawText(ctx, "sec", { x: (CX + pSec.x) / 2, y: CY + SEC_LABEL_OFFSET }, theme.sec, "center", "top", theme.halo);
        drawPoint(ctx, pSec, theme.sec, theme.canvas_dot_bg);
    }

    // --- Cosecant ---
    if (toggles.csc) {
        const pCsc = map(0, csc);
        drawLine(ctx, origin, pCsc, theme.csc, 4);
        drawText(ctx, "csc", { x: CX + CSC_LABEL_OFFSET, y: (CY + pCsc.y) / 2 }, theme.csc, "left", "middle", theme.halo);
        drawPoint(ctx, pCsc, theme.csc, theme.canvas_dot_bg);
    }

    // --- Complementary Angle ---
    if (toggles.comp) {
        ctx.beginPath();
        ctx.strokeStyle = theme.comp;
        ctx.lineWidth = 1.5;
        ctx.arc(CX, CY, COMPLEMENTARY_ARC_RADIUS, -Math.PI / 2, -rad, cos < 0);
        ctx.stroke();

        const compMid = (rad + Math.PI / 2) / 2;
        drawText(ctx, "α", map(Math.cos(compMid) * 0.45, Math.sin(compMid) * 0.45), theme.comp, "center", "middle", theme.halo);

        {
            const alphaR = ALPHA_INDICATOR_RADIUS;
            const angToO = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);
            const angToVert = Math.atan2(pXAxis.y - pCircle.y, pXAxis.x - pCircle.x);

            ctx.beginPath();
            ctx.strokeStyle = theme.comp;
            ctx.lineWidth = 1.5;
            ctx.arc(pCircle.x, pCircle.y, alphaR, angToVert, angToO, false);
            ctx.stroke();

            const midAlpha2 = (angToVert + angToO) / 2;
            drawText(ctx, "α", {
                x: pCircle.x + Math.cos(midAlpha2) * ALPHA_LABEL_OFFSET,
                y: pCircle.y + Math.sin(midAlpha2) * ALPHA_LABEL_OFFSET
            }, theme.comp, "center", "middle", theme.halo);
        }
    }

    // --- Proof Modes ---
    if (toggles.proof_sin_tri) drawSineTriangleProof(proofCtx);
    if (toggles.proof_tan_tri) drawTangentTriangleProof(proofCtx);
    if (toggles.proof_general_unit) drawGeneralFormUnitProof(proofCtx);
    if (toggles.proof_general_target) drawGeneralFormTargetProof(proofCtx);
    if (toggles.proof_pythag_squares) drawPythagoreanSquaresProof(proofCtx);
    if (toggles.proof_pythag_general) drawPythagoreanGeneralProof(proofCtx);

    // --- Axes Intersection Points ---
    if (toggles.axesIntersections) {
        const intersections = [
            { p: map(1, 0), label: '(1, 0)' },
            { p: map(-1, 0), label: '(-1, 0)' },
            { p: map(0, 1), label: '(0, 1)' },
            { p: map(0, -1), label: '(0, -1)' },
        ];
        for (const { p, label } of intersections) {
            drawPoint(ctx, p, theme.text, theme.canvas_dot_bg);
            const offsetX = p.x > CX ? 15 : (p.x < CX ? -15 : 0);
            const offsetY = p.y > CY ? 20 : (p.y < CY ? -20 : 0);
            const align = p.x > CX ? 'left' : (p.x < CX ? 'right' : 'center');
            const base = p.y > CY ? 'top' : (p.y < CY ? 'bottom' : 'middle');
            drawText(ctx, label, { x: p.x + offsetX, y: p.y + offsetY }, theme.text, align, base, theme.halo);
        }
    }

    // --- Show X,Y Coordinates ---
    if (toggles.showXY) {
        const xVal = cos.toFixed(2);
        const yVal = sin.toFixed(2);
        const label = `(${xVal}, ${yVal})`;
        const offsetX = cos >= 0 ? 20 : -20;
        const offsetY = sin >= 0 ? -25 : 25;
        drawText(ctx, label, { x: pCircle.x + offsetX, y: pCircle.y + offsetY }, theme.text, cos >= 0 ? 'left' : 'right', "middle", theme.halo);
    }

    if (!toggles.proof_general_target && !toggles.proof_tan_tri) {
        drawPoint(ctx, pCircle, theme.text, theme.canvas_dot_bg);
    }
};
