// Shared TypeScript interfaces for TrigFlow

export interface Point {
    x: number;
    y: number;
}

export interface TrigTheme {
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
    /** Whether this is a dark theme - used for overlay/contrast decisions */
    isDark: boolean;
}

export interface TrigValues {
    sin: number;
    cos: number;
    tan: number;
    cot: number;
    sec: number;
    csc: number;
}

export interface UnitCircleToggles {
    // === Primary Function Lines ===
    /** Shows the vertical sine line from point P to the x-axis (red) */
    sin: boolean;
    /** Shows the horizontal cosine line from point P to the y-axis (blue) */
    cos: boolean;
    /** Shows the tangent value as a line segment on x=1 (orange) */
    tan: boolean;
    /** Shows the cotangent value as a line segment on y=1 (green) */
    cot: boolean;
    /** Shows the secant line from origin through P to x=1 (purple) */
    sec: boolean;
    /** Shows the cosecant line from origin through P to y=1 (yellow) */
    csc: boolean;

    // === Geometry & Visual Aids ===
    /** Shows the complementary angle (90° - θ) arc and its trigonometric relationships */
    comp: boolean;
    /** Shows the geometric tangent construction: vertical line at x=1 */
    geoTan: boolean;
    /** Shows the geometric cotangent construction: horizontal line at y=1 */
    geoCot: boolean;
    /** Shows the similar triangle for secant: O-P-S triangle with annotations */
    similarSec: boolean;
    /** Shows the similar triangle for cosecant: O-P-C triangle with annotations */
    similarCsc: boolean;
    /** Shows the radius/hypotenuse line from origin to point P (labeled "1") */
    hypotenuse: boolean;
    /** Shows quadrant labels (I, II, III, IV) in each corner */
    quadrants: boolean;
    /** Shows (x, y) coordinate labels at point P */
    showXY: boolean;
    /** Shows unit circle axis intersection points: (1,0), (-1,0), (0,1), (0,-1) */
    axesIntersections: boolean;
    /** When true, draws cosine on the complementary side (P to Y-axis) instead of standard position (O to X-axis).
     *  Used in co-function lessons to demonstrate cos(θ) = sin(90°-θ) visually. */
    cosOnCompSide?: boolean;

    // === Proof Visualization Toggles ===
    /** Proof mode: Shows sin/cos right triangle with labeled sides */
    proof_sin_tri?: boolean;
    /** Proof mode: Shows tangent proof triangle */
    proof_tan_tri?: boolean;
    /** Proof mode: Shows general form with unit circle context */
    proof_general_unit?: boolean;
    /** Proof mode: Shows general form target triangle */
    proof_general_target?: boolean;
    /** Proof mode: Shows Pythagorean squares on unit circle */
    proof_pythag_squares?: boolean;
    /** Proof mode: Shows general Pythagorean theorem (a² + b² = c²) */
    proof_pythag_general?: boolean;
    /** Proof mode: Shows the rearrangement proof (outer square with 4 triangles) */
    proof_pythag_rearrange?: boolean;
    /** Step number for the Pythagorean rearrangement animation (0-2) */
    pythagStep?: number;
}

export interface UnitCircleState {
    angle: number;
    angleUnit: 'deg' | 'rad';
    toggles: UnitCircleToggles;
    theme: TrigTheme;
}
