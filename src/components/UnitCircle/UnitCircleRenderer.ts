import { toRad, createCoordinateMapper, Point } from '../../utils/math';

export interface UnitCircleState {
    angle: number; // in degrees
    angleUnit: 'deg' | 'rad';
    toggles: {
        sin: boolean;
        cos: boolean;
        tan: boolean;
        cot: boolean;
        sec: boolean;
        csc: boolean;
        comp: boolean;
        geoTan: boolean;
        geoCot: boolean;
        similarSec: boolean;
        similarCsc: boolean;
        hypotenuse: boolean;
        quadrants: boolean;
    };
    theme: {
        sin: string;
        cos: string;
        tan: string;
        cot: string;
        sec: string;
        csc: string;
        grid: string;
        axis: string;
        text: string;
        bg: string;
        comp: string;
    };
}

// Helpers for drawing
const drawLine = (
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    width = 2,
    dash: number[] = []
) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
};

const drawText = (
    ctx: CanvasRenderingContext2D,
    str: string,
    p: Point,
    color: string,
    align: CanvasTextAlign = 'center',
    base: CanvasTextBaseline = 'middle'
) => {
    ctx.font = "bold 14px Arial";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(128,128,128,0.2)"; // Softer halo
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.strokeText(str, p.x, p.y);
    ctx.fillStyle = color;
    ctx.fillText(str, p.x, p.y);
};

const drawPoint = (
    ctx: CanvasRenderingContext2D,
    p: Point,
    color: string,
    borderColor = '#fff'
) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
};

const drawQuadrants = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    theme: UnitCircleState['theme']
) => {
    const W = width;
    const H = height;
    const CX = W / 2;
    const CY = H / 2;
    // Place roughly in center of each quadrant
    // Dimensions: 0..CX is left, CX..W is right
    // 0..CY is top, CY..H is bottom

    // Font setup
    ctx.font = "bold 120px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = theme.bg === '#212529' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';

    // Q1: Top-Right (Cartesian Q1), but Canvas Y is down.
    // Cartesian Q1 (+, +) -> Canvas (Right, Up) -> (Current Canvas logic: Y is down?)
    // createCoordinateMapper flips Y. So ( +, + ) is Top-Right in visual space.
    // Let's check visual placement.
    // Top-Right: X > CX, Y < CY
    ctx.fillText("I", CX + W / 4, CY - H / 4);

    // Q2: Top-Left
    // X < CX, Y < CY
    ctx.fillText("II", CX - W / 4, CY - H / 4);

    // Q3: Bottom-Left
    // X < CX, Y > CY
    ctx.fillText("III", CX - W / 4, CY + H / 4);

    // Q4: Bottom-Right
    // X > CX, Y > CY
    ctx.fillText("IV", CX + W / 4, CY + H / 4);
};


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

            // Wait, coordinate mapper handles Y flip for 'map'.
            // Here we are in canvas pixels.
            // pXAxis is on the visual X-axis (CY).
            // P is at pCircle.
            // Vector pXAxis -> P.
            // If sin > 0 (upper half), P is above pXAxis (smaller Y). So we go UP (-1).
            // If cos > 0 (right half), Origin is to the left (-1).

            // Actually, we want the square "inside" the triangle O-A-P.
            // A is pXAxis. O is origin. P is pCircle.
            // Vector A->O is towards center.
            // Vector A->P is vertical.

            // Direction to Origin:
            const dirToOriginX = origin.x - pXAxis.x;
            const signX = dirToOriginX >= 0 ? 1 : -1;

            // Direction to P (Vertical):
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
        // Angle is at pCircle.
        // Rays are pCircle->pXAxis (Vertical) and pCircle->Origin (Hypotenuse).
        {
            const alphaR = 20;
            const angVertical = Math.atan2(pXAxis.y - pCircle.y, pXAxis.x - pCircle.x);
            const angHypot = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);

            ctx.beginPath();
            ctx.strokeStyle = theme.text;
            ctx.lineWidth = 1;
            ctx.arc(pCircle.x, pCircle.y, alphaR, angVertical, angHypot, false); // Direct arc?
            // Need to check chirality for 'counterclockwise' param.
            // Visual inspection: Vertical is roughly PI/2 (down) or -PI/2 (up). Hypotenuse is variable.
            // Just force it:
            ctx.stroke();

            // Alpha Label
            const midAlpha = (angVertical + angHypot) / 2;
            drawText(ctx, "α", {
                x: pCircle.x + Math.cos(midAlpha) * 30,
                y: pCircle.y + Math.sin(midAlpha) * 30
            }, theme.text);
        }

        // 3. Right Angle at P(cos, sin) for Secant/Tangent Triangle
        // Vertices: Origin, P(circle), P(sec).
        // Angle at P(circle) is 90 deg.
        // Between Radius (P->O) and Tangent (P->Psec).
        {
            // Vector P->O
            const dirToOX = origin.x - pCircle.x;
            const dirToOY = origin.y - pCircle.y;
            // Normalize
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

        // --- ANGLE LABELS for Triangle ---
        // 1. Angle theta at Top (P_circle) -- WAIT, theta is at origin.
        // Existing code had "Angle theta at Top (P_circle)". 
        // REVIEW: In previous code, I labeled theta at P_Circle. That's WRONG.
        // Theta is at Origin.
        // In the SECANT triangle (O, P, Sec), the angle at O is 'theta'.
        // The angle at Sec is 'alpha' (90-theta).
        // The angle at P is 90.
        // Previous code labeled P_Circle as 'theta' and P_Sec as 'alpha'.
        // Actually, P_Circle angle is 90.
        // In the "Similar Triangle" logic, maybe the user meant the *complementary* triangle?
        // Wait, Triangle O-P-Sec is similar to standard O-A-P.
        // Angle at O is shared (theta).
        // Angle at P (in secant tri) is 90. Angle at A (in standard) is 90.
        // Angle at Sec is alpha. Angle at P (in standard) is alpha.

        // Correcting previous labels if necessary, but preserving user intent if they asked for specific things.
        // The previous code block (which I am replacing part of) had:
        // "Angle theta at Top (P_circle)" -> atan2(pSec - pCircle). This is the angle of the tangent line.
        // This seems to be measuring the external angle? 
        // Let's stick to the new requests. I will preserve the existing labels but fixing the 'alpha' request.


        // --- NEW: Duplicate Triangle (Complementary) ---
        // 1. Dotted Horizontal Line (Duplicate Cosine)
        // From P(cos, sin) to Py(0, sin)
        drawLine(ctx, pCircle, pYAxis, theme.text, 1, [4, 4]);

        // 2. Dotted Vertical Line (Duplicate Sine)
        // From Origin(0,0) to Py(0, sin) - effectively the Y-axis segment
        drawLine(ctx, origin, pYAxis, theme.text, 1, [4, 4]);

        // 3. Right Angle at Py(0, sin)
        const raSize = 10;

        // pYAxis is on the Y-axis. The line comes from P(cos, sin).
        // The right angle is between the vertical axis and the horizontal line.
        // It should point towards P and towards Origin? No, just a square at the intersection.
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        // Draw square corner at pYAxis
        // Corners: (0, sin), (dirX*size, sin), (dirX*size, sin-dirY*size), (0, sin-dirY*size)
        // Wait, pYAxis IS (0, sin).
        // We want the square in the quadrant towards P and Origin?
        // The angle is at (0, sin). Legs are (0,0)-(0,sin) and (cos,sin)-(0,sin).
        // So the square should be "inside" that junction.
        // Towards X=cos (dirX) and Y=0 (dirY? No, down towards origin). 
        // O is (0,0). Py is (0,sin). Vector Py->O is (0, -sin). Direction is -sign(sin).
        // P is (cos, sin). Vector Py->P is (cos, 0). Direction is sign(cos).
        const dY = sin >= 0 ? -1 : 1; // Down towards origin if sin>0
        const dX = cos >= 0 ? 1 : -1; // Towards P

        ctx.moveTo(pYAxis.x + dX * raSize, pYAxis.y);
        ctx.lineTo(pYAxis.x + dX * raSize, pYAxis.y + dY * raSize);
        ctx.lineTo(pYAxis.x, pYAxis.y + dY * raSize);
        ctx.stroke();

        // 4. Alpha Angle at Origin (0,0)
        // Between Y-axis (PI/2) and Radius (rad)
        // Note: 'rad' is angle from X-axis. 'PI/2' is Y-axis.
        // Arc from rad to PI/2
        const alphaR = 20;
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        // rad is normal angle.
        // We want arc between PI/2 and rad?
        // Wait, radius is at 'rad'. Y-axis is at -PI/2 in canvas? No, canvas Y is down? 
        // toRad handles degrees. coordinateMapper handles Y-flip.
        // Let's use points to be safe or raw angles.
        // Canvas angles: 0 is Right. PI/2 is Down (in raw canvas). -PI/2 is Up.
        // Our 'rad' is mathematical (CCW from Right).
        // render 'arc' takes canvas angles.
        // We should calculate start/end angles in canvas space.
        const angleCanvasRad = -rad; // Canvas Y is flipped. +rad means UP, which is -angle in canvas.
        const angleCanvasY = -Math.PI / 2; // Up
        ctx.arc(origin.x, origin.y, alphaR, angleCanvasY, angleCanvasRad, false);
        ctx.stroke();
        // Label alpha near origin
        // Mid-angle
        const midAlpha = (angleCanvasY + angleCanvasRad) / 2;
        // Position slightly offset
        drawText(ctx, "α", {
            x: origin.x + Math.cos(midAlpha) * 35,
            y: origin.y + Math.sin(midAlpha) * 35
        }, theme.text);


        // 5. Theta Angle at P(cos, sin)
        // Between Vertical (up/down?) No, between Horizontal Line (P->Py) and Radius (P->O).
        // Radius P->O angle: From P to O. P=(cos, sin). O=(0,0). Vector is (-cos, -sin).
        // Canvas angle of vector P->O: Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x).
        // Horizontal Line P->Py angle: Vector (-cos, 0).
        // Canvas angle: Math.atan2(pYAxis.y - pCircle.y, pYAxis.x - pCircle.x).
        const thetaR = 20;
        const angPO = Math.atan2(origin.y - pCircle.y, origin.x - pCircle.x);
        const angPPy = Math.atan2(pYAxis.y - pCircle.y, pYAxis.x - pCircle.x);

        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.arc(pCircle.x, pCircle.y, thetaR, angPPy, angPO, rad > 0); // Direction?
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

        // Theta at C (0, csc)
        {
            const arcR = 25;
            // Vector C->P
            const angHypot = Math.atan2(pCircle.y - pCsc.y, pCircle.x - pCsc.x);
            // Vector C->O
            const angBase = Math.atan2(origin.y - pCsc.y, origin.x - pCsc.x);

            ctx.beginPath();
            ctx.strokeStyle = theme.text;
            ctx.lineWidth = 1;
            ctx.arc(pCsc.x, pCsc.y, arcR, angBase, angHypot, false); // Check chirality?
            ctx.stroke();

            drawText(ctx, "θ", { x: pCsc.x + 10, y: pCsc.y + (csc > 0 ? 35 : -35) }, theme.text);
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
    }

    // Point P
    drawPoint(ctx, pCircle, theme.text, theme.bg);
};
