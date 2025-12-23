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
}

export interface UnitCircleToggles {
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
    showXY: boolean;
    // Proof toggles
    proof_sin_tri?: boolean;
    proof_tan_tri?: boolean;
    proof_general_unit?: boolean;
    proof_general_target?: boolean;
    proof_pythag_squares?: boolean;
    proof_pythag_general?: boolean;
}

export interface UnitCircleState {
    angle: number;
    angleUnit: 'deg' | 'rad';
    toggles: UnitCircleToggles;
    theme: TrigTheme;
}
