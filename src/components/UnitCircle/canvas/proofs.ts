/**
 * Proof visualization drawing functions for TrigFlow.
 * Extracted from UnitCircleRenderer.ts for maintainability.
 */

import { Point, UnitCircleState } from '../../../types';
import { drawLine, drawText } from './helpers';

/**
 * Shared context for proof drawing functions.
 * Bundles commonly needed values to avoid 12+ parameter lists.
 */
export interface ProofContext {
    ctx: CanvasRenderingContext2D;
    origin: Point;
    pCircle: Point;
    pXAxis: Point;
    CX: number;
    CY: number;
    map: (x: number, y: number) => Point;
    rad: number;
    cos: number;
    sin: number;
    tan: number;
    theme: UnitCircleState['theme'];
}

/**
 * Draw the Sine Triangle proof visualization.
 * Shows a right triangle with sin, cos, and hypotenuse labeled.
 */
export function drawSineTriangleProof(c: ProofContext): void {
    const { ctx, origin, pCircle, pXAxis, cos, rad, theme, map } = c;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pXAxis.x, pXAxis.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.closePath();
    ctx.fill();

    // Outline specific sides
    drawLine(ctx, origin, pXAxis, theme.cos, 4);
    drawLine(ctx, pXAxis, pCircle, theme.sin, 4);
    drawLine(ctx, origin, pCircle, theme.text, 2);

    // Labels
    drawText(ctx, "1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
    drawText(ctx, "cos", { x: (c.CX + pXAxis.x) / 2, y: c.CY + 15 }, theme.cos);
    drawText(ctx, "sin", { x: pXAxis.x + (cos >= 0 ? 15 : -15), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right");
}

/**
 * Draw the Tangent Triangle proof visualization.
 * Shows a triangle with tan segment on x=1 line.
 */
export function drawTangentTriangleProof(c: ProofContext): void {
    const { ctx, origin, cos, tan, theme, map, CY } = c;

    const dir = cos >= 0 ? 1 : -1;
    const pStart = map(dir, 0);
    const pEnd = map(dir, dir * tan);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(230, 126, 34, 0.2)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pStart.x, pStart.y);
    ctx.lineTo(pEnd.x, pEnd.y);
    ctx.closePath();
    ctx.fill();

    // Outline specific sides
    drawLine(ctx, origin, pStart, theme.text, 3);
    drawLine(ctx, pStart, pEnd, theme.tan, 4);
    drawLine(ctx, origin, pEnd, theme.text, 2, [6, 4]);

    // Labels
    drawText(ctx, "1", { x: (origin.x + pStart.x) / 2, y: CY + 20 }, theme.text);
    drawText(ctx, "tan", { x: pStart.x + dir * 20, y: (pStart.y + pEnd.y) / 2 }, theme.tan, dir > 0 ? "left" : "right");
}

/**
 * Draw the General Form proof visualization.
 * Shows unit circle context for SOH CAH TOA.
 */
export function drawGeneralFormUnitProof(c: ProofContext): void {
    const { ctx, origin, pCircle, pXAxis, cos, rad, theme, map } = c;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pXAxis.x, pXAxis.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.closePath();
    ctx.fill();

    drawLine(ctx, origin, pXAxis, theme.text, 2);
    drawLine(ctx, pXAxis, pCircle, theme.sin, 3);
    drawLine(ctx, origin, pCircle, theme.text, 2);

    drawText(ctx, "sin θ", { x: pXAxis.x + (cos >= 0 ? 20 : -20), y: (pXAxis.y + pCircle.y) / 2 }, theme.sin, cos >= 0 ? "left" : "right");
    drawText(ctx, "1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
}

/**
 * Draw the General Form target triangle (scaled up).
 */
export function drawGeneralFormTargetProof(c: ProofContext): void {
    const { ctx, origin, cos, rad, theme, map, CY } = c;

    const scale = 1.35;
    const pGenEnd = map(Math.cos(rad) * scale, Math.sin(rad) * scale);
    const pGenAxis = { x: pGenEnd.x, y: origin.y };

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = theme.text;
    ctx.lineWidth = 1;
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pGenEnd.x, pGenEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pGenAxis.x, pGenAxis.y);
    ctx.lineTo(pGenEnd.x, pGenEnd.y);
    ctx.closePath();
    ctx.fill();

    drawLine(ctx, origin, pGenAxis, theme.text, 2);
    drawLine(ctx, pGenAxis, pGenEnd, theme.tan, 3);
    drawLine(ctx, origin, pGenEnd, theme.text, 2);

    drawText(ctx, "H", map(Math.cos(rad) * scale * 0.55, Math.sin(rad) * scale * 0.55), theme.text);
    drawText(ctx, "O", { x: pGenAxis.x + (cos >= 0 ? 15 : -15), y: (pGenAxis.y + pGenEnd.y) / 2 }, theme.tan, cos >= 0 ? "left" : "right");
    drawText(ctx, "A", { x: (origin.x + pGenAxis.x) / 2, y: CY + 15 }, theme.text);
}

/**
 * Draw Pythagorean squares on the sine triangle (unit circle version).
 * Shows a² + b² = c² with c=1.
 */
export function drawPythagoreanSquaresProof(c: ProofContext): void {
    const { ctx, origin, pCircle, pXAxis, cos, rad, theme, map } = c;

    // Square on Adjacent (Cos) - Blue
    const cosSize = Math.abs(pXAxis.x - origin.x);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(Math.min(origin.x, pXAxis.x), origin.y, cosSize, cosSize);

    // Square on Sine (Red)
    const sinSize = Math.abs(pCircle.y - pXAxis.y);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    const dir = cos >= 0 ? 1 : -1;
    ctx.fillRect(pXAxis.x, Math.min(pXAxis.y, pCircle.y), sinSize * dir, sinSize);

    // Labels
    if (cosSize > 10) drawText(ctx, "a²", { x: (origin.x + pXAxis.x) / 2, y: origin.y + cosSize / 2 }, theme.cos);
    if (sinSize > 10) drawText(ctx, "b²", { x: pXAxis.x + (sinSize * dir) / 2, y: (pXAxis.y + pCircle.y) / 2 }, theme.sin);

    // Square on Hypotenuse (c=1)
    drawText(ctx, "c² = 1", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
}

/**
 * Draw General Pythagorean Theorem proof.
 * Shows a generic right triangle with squares on all sides (a², b², c²).
 */
export function drawPythagoreanGeneralProof(c: ProofContext): void {
    const { ctx, origin, pCircle, pXAxis, cos, rad, theme, map, CY } = c;

    // 1. Triangle
    ctx.beginPath();
    ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pXAxis.x, pXAxis.y);
    ctx.lineTo(pCircle.x, pCircle.y);
    ctx.closePath();
    ctx.fill();

    // 2. Squares
    const dir = cos >= 0 ? 1 : -1;

    // Square on Adjacent (a)
    const aSize = Math.abs(pXAxis.x - origin.x);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(Math.min(origin.x, pXAxis.x), origin.y, aSize, aSize);
    drawText(ctx, "a²", { x: (origin.x + pXAxis.x) / 2, y: origin.y + aSize / 2 }, theme.text);

    // Square on Opposite (b)
    const bSize = Math.abs(pCircle.y - pXAxis.y);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(pXAxis.x, Math.min(pXAxis.y, pCircle.y), bSize * dir, bSize);
    drawText(ctx, "b²", { x: pXAxis.x + (bSize * dir) / 2, y: (pXAxis.y + pCircle.y) / 2 }, theme.text);

    // Square on Hypotenuse (c) - Rotated
    const P1 = origin;
    const P2 = pCircle;
    const dx = P2.x - P1.x;
    const dy = P2.y - P1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const scale = len;

    const P3 = { x: P2.x - nx * scale, y: P2.y - ny * scale };
    const P4 = { x: P1.x - nx * scale, y: P1.y - ny * scale };

    ctx.beginPath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
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
    drawText(ctx, "a", { x: (origin.x + pXAxis.x) / 2, y: CY - 10 }, theme.text);
    drawText(ctx, "b", { x: pXAxis.x + (dir * 10), y: (pXAxis.y + pCircle.y) / 2 }, theme.text);
    drawText(ctx, "c", map(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5), theme.text);
}
