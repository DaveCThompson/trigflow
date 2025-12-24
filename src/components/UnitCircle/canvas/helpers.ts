/**
 * Canvas drawing helper functions for TrigFlow visualizations.
 * Extracted from UnitCircleRenderer.ts for maintainability.
 */

import { Point, UnitCircleState } from '../../../types';

/**
 * Draw a line between two points.
 */
export const drawLine = (
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    width = 2,
    dash: number[] = []
): void => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
};

/**
 * Draw text with a soft halo for legibility.
 */
export const drawText = (
    ctx: CanvasRenderingContext2D,
    str: string,
    p: Point,
    color: string,
    align: CanvasTextAlign = 'center',
    base: CanvasTextBaseline = 'middle'
): void => {
    ctx.font = "bold 14px Inter, Arial, sans-serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(128,128,128,0.2)";
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.strokeText(str, p.x, p.y);
    ctx.fillStyle = color;
    ctx.fillText(str, p.x, p.y);
};

/**
 * Draw a point/dot with border.
 */
export const drawPoint = (
    ctx: CanvasRenderingContext2D,
    p: Point,
    color: string,
    borderColor = '#fff'
): void => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
};

/**
 * Draw quadrant labels (I, II, III, IV) in background.
 */
export const drawQuadrants = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    theme: UnitCircleState['theme']
): void => {
    const W = width;
    const H = height;
    const CX = W / 2;
    const CY = H / 2;

    ctx.font = "bold 120px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = theme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';

    // Q1: Top-Right
    ctx.fillText("I", CX + W / 4, CY - H / 4);
    // Q2: Top-Left
    ctx.fillText("II", CX - W / 4, CY - H / 4);
    // Q3: Bottom-Left
    ctx.fillText("III", CX - W / 4, CY + H / 4);
    // Q4: Bottom-Right
    ctx.fillText("IV", CX + W / 4, CY + H / 4);
};

/**
 * Draw a right angle marker at a point.
 */
export const drawRightAngle = (
    ctx: CanvasRenderingContext2D,
    vertex: Point,
    dirX: number,
    dirY: number,
    size: number,
    color: string
): void => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.moveTo(vertex.x + dirX * size, vertex.y);
    ctx.lineTo(vertex.x + dirX * size, vertex.y + dirY * size);
    ctx.lineTo(vertex.x, vertex.y + dirY * size);
    ctx.stroke();
};
