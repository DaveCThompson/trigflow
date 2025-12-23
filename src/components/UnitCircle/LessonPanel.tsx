import React, { useEffect } from 'react';
import { UnitCircleState } from './UnitCircleRenderer';
import { DiagramType } from './DiagramPanel';

export type LessonId = 'unit_circle' | 'sine' | 'cosine' | 'tangent' | 'cotangent' | 'secant' | 'cosecant' | 'tangent_identity' | 'general_form' | 'pythagorean' | 'pythagorean_identity';

interface LessonData {
    id: LessonId;
    title: string;
    quote: React.ReactNode;
    details: React.ReactNode[];
    diagram: DiagramType;
    apply: (setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>) => void;
}

export const RESET_DEFAULTS: Partial<UnitCircleState['toggles']> = {
    sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
    hypotenuse: false, quadrants: false, geoTan: false, geoCot: false,
    similarSec: false, similarCsc: false, comp: false,
    proof_sin_tri: false, proof_tan_tri: false,
    proof_pythag_squares: false, proof_pythag_general: false
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
            quadrants: true, comp: true,
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
            quadrants: true, comp: true,
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
            csc: true, similarCsc: true, hypotenuse: true, geoCot: true
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
            proof_sin_tri: true, // Start with Step 0
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
            proof_general_unit: true // Initial state for General Form
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
        diagram: 'pythagorean', // General form
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            proof_pythag_general: true // New toggle
        }))
    },
    {
        id: 'pythagorean_identity',
        title: 'Pythagorean Identity',
        quote: <>
            <strong className="font-extrabold text-2xl block mb-2">sin²(θ) + cos²(θ) = 1</strong>
        </>,
        details: [
            "Applying the Pythagorean Theorem to the Unit Circle.",
            "a = cos(θ), b = sin(θ), c = 1",
            "Therefore: cos²(θ) + sin²(θ) = 1² = 1"
        ],
        diagram: 'pythagorean_identity', // Specific Identity
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sin: true, cos: true, hypotenuse: true,
            proof_pythag_squares: true // Start with squares visible? Or let stepper handle it.
            // Actually, best to let stepper handle specific toggles, but here we set defaults.
            // Stepper will override if needed.
        }))
    }
];

interface LessonPanelProps {
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    selectedLessonId: LessonId;
    onLessonChange: (id: LessonId) => void;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({ setToggles, selectedLessonId, onLessonChange }) => {

    // Apply lesson Logic when selection changes (handled by parent calling this, but we can double check or just let parent handle)
    // Actually, usually the parent sets the ID, and we trigger the APPLY.
    // Or we keep the apply logic here.

    // Let's do it in useEffect to sync when prop changes
    useEffect(() => {
        const lesson = LESSONS.find(l => l.id === selectedLessonId);
        if (lesson) {
            lesson.apply(setToggles);
        }
    }, [selectedLessonId, setToggles]);


    const currentLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

    return (
        <div className="w-full xl:w-[320px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6 h-fit sticky top-6">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Lessons
                </h2>
                <select
                    value={selectedLessonId}
                    onChange={(e) => onLessonChange(e.target.value as LessonId)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {LESSONS.map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-6">
                <div className="text-gray-800 dark:text-gray-100">
                    {currentLesson.quote}
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Key Concepts
                    </h3>
                    <ul className="space-y-2">
                        {currentLesson.details.map((detail, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
