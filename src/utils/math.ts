export const PI = Math.PI;
export const TAU = Math.PI * 2;

export const toRad = (deg: number): number => (deg * PI) / 180;
export const toDeg = (rad: number): number => (rad * 180) / PI;

export const normalizeAngle = (angle: number): number => {
    let a = angle % 360;
    if (a < 0) a += 360;
    return a;
};

export const clamp = (val: number, min: number, max: number): number => 
    Math.min(Math.max(val, min), max);

export interface Point {
    x: number;
    y: number;
}

export const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Canvas coordinate mapper
// Maps unit circle coordinates (center 0,0, Y up) to Canvas coordinates (center CX,CY, Y down)
export const createCoordinateMapper = (
    cx: number, 
    cy: number, 
    scale: number
) => {
    return (x: number, y: number): Point => {
        // Clamp to avoid Infinity issues in drawing
        const safeX = clamp(x, -1000, 1000);
        const safeY = clamp(y, -1000, 1000);
        
        return {
            x: cx + safeX * scale,
            y: cy - safeY * scale // Invert Y for canvas
        };
    };
};

export const formatNumber = (num: number) => {
    if (Math.abs(num) > 1000) return num < 0 ? "-∞" : "+∞";
    return num.toFixed(3);
};
