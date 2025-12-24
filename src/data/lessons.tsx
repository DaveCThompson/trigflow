/**
 * Lesson data definitions for TrigFlow educational content.
 * Extracted from LessonPanel.tsx for maintainability.
 */

import React from 'react';
import { UnitCircleState } from '../types';
import { DiagramType } from '../components/UnitCircle/DiagramPanel';

export type LessonId = 'unit_circle' | 'sine' | 'cosine' | 'tangent' | 'cotangent' | 'secant' | 'cosecant' | 'tangent_identity' | 'general_form' | 'pythagorean' | 'pythagorean_identity' | 'pythag_identity_2' | 'pythag_identity_3' | 'identities';

export interface LessonData {
    id: LessonId;
    title: string;
    quote: React.ReactNode;
    details: React.ReactNode[];
    diagram: DiagramType;
    apply: (setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>) => void;
}

export const RESET_DEFAULTS: Partial<UnitCircleState['toggles']> = {
    sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
    hypotenuse: false, quadrants: false, showXY: false, geoTan: false, geoCot: false,
    similarSec: false, similarCsc: false, comp: false, axesIntersections: false,
    cosOnCompSide: false,
    proof_sin_tri: false, proof_tan_tri: false,
    proof_pythag_squares: false, proof_pythag_general: false, proof_pythag_rearrange: false
};

export const LESSONS: LessonData[] = [
    {
        id: 'unit_circle',
        title: 'Unit Circle',
        quote: <span className="text-xl font-light">The foundation of trigonometry.</span>,
        details: [
            "A circle with a radius of exactly 1.",
            "Centered at the origin (0,0) of the Cartesian plane."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sin: true, cos: true, hypotenuse: true
        }))
    },
    {
        id: 'sine',
        title: 'Sine',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Sine is the vertical (Y) coordinate.</strong>
        </>,
        details: [
            "Range: [-1, 1]",
            "Positive in Quadrants I and II (upper half).",
            "Zero at 0° and 180°.",
            "Minimum at 270° (-1). Maximum at 90° (1)."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            sin: true, cos: false, tan: false, cot: false, sec: false, csc: false,
            quadrants: true, comp: false,
            hypotenuse: true, geoTan: false, geoCot: false, similarSec: false, similarCsc: false
        }))
    },
    {
        id: 'cosine',
        title: 'Cosine',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Cosine is the horizontal (X) coordinate.</strong>
        </>,
        details: [
            "Range: [-1, 1]",
            "Positive in Quadrants I and IV (right half).",
            "Zero at 90° and 270°.",
            "Maximum at 0° (1). Minimum at 180° (-1)."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: true, tan: false, cot: false, sec: false, csc: false,
            quadrants: true, comp: false,
            hypotenuse: true, geoTan: false, geoCot: false, similarSec: false, similarCsc: false
        }))
    },
    {
        id: 'tangent',
        title: 'Tangent',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Tangent line touches the circle.</strong>
        </>,
        details: [
            <>From Latin <em>tangere</em> ("to touch").</>,
            "Range: (-∞, ∞)",
            "Shown as the segment on the line x=1 OR the ratio sin/cos."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: false, tan: true, cot: false, sec: false, csc: false,
            geoTan: true,
            hypotenuse: true, quadrants: false, similarSec: false, similarCsc: false
        }))
    },
    {
        id: 'cotangent',
        title: 'Cotangent',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Cotangent is the complementary tangent.</strong>
        </>,
        details: [
            "Range: (-∞, ∞)",
            "Shown as the segment on the line y=1.",
            "Ratio cos/sin."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: false, tan: false, cot: true, sec: false, csc: false,
            geoCot: true,
            hypotenuse: true, quadrants: false, geoTan: false, similarSec: false, similarCsc: false
        }))
    },
    {
        id: 'secant',
        title: 'Secant',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Secant line cuts the circle.</strong>
        </>,
        details: [
            <>From Latin <em>secare</em> ("to cut").</>,
            "Range: (-∞, -1] U [1, ∞) (U means Union)",
            "The hypotenuse of the triangle formed by the tangent."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sec: true, similarSec: true, hypotenuse: true
        }))
    },
    {
        id: 'cosecant',
        title: 'Cosecant',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">Cosecant is the complementary secant.</strong>
        </>,
        details: [
            "Range: (-∞, -1] U [1, ∞)",
            "The hypotenuse of the triangle formed by the cotangent."
        ],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            csc: true, similarCsc: true, hypotenuse: true
        })),
    },
    {
        id: 'tangent_identity',
        title: 'Tangent Identity',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">tan θ = sin θ / cos θ</strong>
        </>,
        details: [
            "We can see two Similar Triangles.",
            "Small Triangle: sides sin, cos, 1.",
            "Large Triangle: sides tan, 1, sec.",
            "The ratio of Vertical/Horizontal is the same for both."
        ],
        diagram: 'tangent_identity',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            proof_sin_tri: true,
        }))
    },
    {
        id: 'general_form',
        title: 'General Form',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">SOH CAH TOA</strong>
        </>,
        details: [
            "General relationships for any right triangle.",
            "sin(θ) = Opposite / Hypotenuse",
            "cos(θ) = Adjacent / Hypotenuse",
            "tan(θ) = Opposite / Adjacent"
        ],
        diagram: 'general_form',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            proof_general_unit: true
        }))
    },
    {
        id: 'pythagorean',
        title: 'Pythagorean Theorem',
        quote: <span className="text-xl font-light">The fundamental relationship in Euclidean geometry.</span>,
        details: [
            "In a right-angled triangle:",
            "The square of the hypotenuse (c) is equal to the sum of the squares of the other two sides (a and b).",
            "a² + b² = c²"
        ],
        diagram: 'pythagorean',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            proof_pythag_rearrange: true
        }))
    },
    {
        id: 'pythagorean_identity',
        title: 'Identity: sin² + cos² = 1',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">sin²θ + cos²θ = 1</strong>
        </>,
        details: [
            "The fundamental Pythagorean identity.",
            "Derived from applying a² + b² = c² to the unit circle."
        ],
        diagram: 'pythagorean_identity',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sin: true, cos: true, hypotenuse: true
        }))
    },
    {
        id: 'pythag_identity_2',
        title: 'Identity: tan² + 1 = sec²',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">tan²θ + 1 = sec²θ</strong>
        </>,
        details: [
            "Derived by dividing sin² + cos² = 1 by cos².",
            "Shows the relationship between tangent and secant."
        ],
        diagram: 'pythag_identity_2',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            tan: true, sec: true, hypotenuse: true, geoTan: true
        }))
    },
    {
        id: 'pythag_identity_3',
        title: 'Identity: 1 + cot² = csc²',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">1 + cot²θ = csc²θ</strong>
        </>,
        details: [
            "Derived by dividing sin² + cos² = 1 by sin².",
            "Shows the relationship between cotangent and cosecant."
        ],
        diagram: 'pythag_identity_3',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            cot: true, csc: true, hypotenuse: true, geoCot: true
        }))
    },
    {
        id: 'identities',
        title: '📐 Trig Identities',
        quote: <span className="text-xl font-light">Complete reference of trigonometric identities.</span>,
        details: [],
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sin: true, cos: true, tan: true, cot: true, sec: true, csc: true,
            hypotenuse: true
        }))
    }
];
