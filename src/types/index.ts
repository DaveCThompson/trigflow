// Shared TypeScript interfaces for Visual Trig

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

    /** Primary label color (High Contrast) - e.g. Axis Labels */
    label_primary: string;
    /** Secondary label color - e.g. Ticks */
    label_secondary: string;
    /** Text color for labels sitting on top of colored fills (Wedges/Triangles) */
    label_on_fill: string;
    /** Halo/Stroke color for text readability */
    halo: string;

    // Interactive States
    /** Main CTA color (e.g., cos blue) */
    action_primary: string;
    /** Hover state for primary actions */
    action_primary_hover: string;
    /** Destructive actions (e.g., reset button) */
    action_danger: string;
    /** Danger bg with low opacity */
    action_danger_subtle: string;

    // Selection & Focus
    /** Selected item background */
    surface_selected: string;
    /** Text on selected background */
    surface_selected_text: string;
    /** Focus ring color */
    border_focus: string;
    /** Selected item border */
    border_selected: string;

    // Wedge/Fill specific
    /** Theta angle fill (darker in light mode) */
    fill_angle_wedge: string;

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

/**
 * Lesson context configuration for declarative control visibility.
 * Replaces imperative apply() pattern for better maintainability.
 */
export interface LessonContext {
    /** List of toggle controls that should be visible in the sidebar for this lesson */
    visible: (keyof UnitCircleToggles)[];
    /** Default toggle states when this lesson is selected */
    defaults: Partial<UnitCircleToggles>;
}
