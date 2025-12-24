import React, { useEffect } from 'react';
import { UnitCircleState } from './UnitCircleRenderer';
import { DiagramType } from './DiagramPanel';

export type LessonId = 'unit_circle' | 'sine' | 'cosine' | 'tangent' | 'cotangent' | 'secant' | 'cosecant' | 'tangent_identity' | 'general_form' | 'pythagorean' | 'pythagorean_identity' | 'identities';

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
    hypotenuse: false, quadrants: false, showXY: false, geoTan: false, geoCot: false,
    similarSec: false, similarCsc: false, comp: false, axesIntersections: false,
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
    },
    {
        id: 'identities',
        title: '📐 Trig Identities',
        quote: <span className="text-xl font-light">Complete reference of trigonometric identities.</span>,
        details: [], // Content handled by custom rendering below
        diagram: 'none',
        apply: (set) => set(prev => ({
            ...prev,
            ...RESET_DEFAULTS,
            sin: true, cos: true, tan: true, cot: true, sec: true, csc: true,
            hypotenuse: true
        }))
    }
];

// ============================================================================
// IDENTITIES LESSON COMPONENTS
// ============================================================================

// Color constants matching the visualization theme (using dark theme for better contrast)
const COLORS = {
    sin: '#ff6b6b',
    cos: '#4dabf7',
    tan: '#ff922b',
    cot: '#51cf66',
    sec: '#cc5de8',
    csc: '#fcc419',
    neutral: '#adb5bd',
};

// Fraction component with proper horizontal bar (no slashes)
const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode; color?: string }> = ({ n, d, color }) => (
    <span className="inline-flex flex-col items-center mx-0.5 leading-tight" style={{ color }}>
        <span className="text-xs">{n}</span>
        <span className="w-full border-t border-current" style={{ marginTop: '1px', marginBottom: '1px' }} />
        <span className="text-xs">{d}</span>
    </span>
);

// Identity card with proper styling
const Card: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
    <div
        className="px-3 py-2 rounded-lg border text-center flex items-center justify-center"
        style={{
            borderColor: color || COLORS.neutral,
            backgroundColor: color ? `${color}15` : 'transparent',
        }}
    >
        {children}
    </div>
);

// Category section header
const Category: React.FC<{ title: string; level?: string }> = ({ title, level }) => (
    <div className="mt-4 mb-2 first:mt-0">
        <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
            {level && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {level}
                </span>
            )}
        </div>
    </div>
);

// Colored function name
const Fn: React.FC<{ name: 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'; sup?: string }> = ({ name, sup }) => (
    <span style={{ color: COLORS[name] }}>
        {name}{sup && <sup>{sup}</sup>}
    </span>
);

// Level type for filtering
type IdentityLevel = 'all' | 'basic' | 'intermediate' | 'advanced';

// Level toggle button
const LevelBtn: React.FC<{ level: IdentityLevel; current: IdentityLevel; onClick: () => void }> = ({ level, current, onClick }) => (
    <button
        onClick={onClick}
        className={`px-2 py-1 text-xs rounded-md transition-colors ${current === level
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
    >
        {level.charAt(0).toUpperCase() + level.slice(1)}
    </button>
);

// The main Identities Content component with level filter
const IdentitiesContent: React.FC = () => {
    const [levelFilter, setLevelFilter] = React.useState<IdentityLevel>('all');

    const show = (level: 'basic' | 'intermediate' | 'advanced') =>
        levelFilter === 'all' || levelFilter === level;

    return (
        <div className="space-y-1">
            {/* Level Filter Toggle */}
            <div className="flex gap-1 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <LevelBtn level="all" current={levelFilter} onClick={() => setLevelFilter('all')} />
                <LevelBtn level="basic" current={levelFilter} onClick={() => setLevelFilter('basic')} />
                <LevelBtn level="intermediate" current={levelFilter} onClick={() => setLevelFilter('intermediate')} />
                <LevelBtn level="advanced" current={levelFilter} onClick={() => setLevelFilter('advanced')} />
            </div>

            <div className="max-h-[55vh] overflow-y-auto pr-2 -mr-2 space-y-1">
                {/* ============ BASIC LEVEL ============ */}
                {show('basic') && (
                    <>
                        {/* BASIC DEFINITIONS (SOH CAH TOA) */}
                        <Category title="Basic Definitions" level="Basic" />
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <Card color={COLORS.sin}>
                                <Fn name="sin" /> = <Frac n="o" d="h" color={COLORS.sin} />
                            </Card>
                            <Card color={COLORS.cos}>
                                <Fn name="cos" /> = <Frac n="a" d="h" color={COLORS.cos} />
                            </Card>
                            <Card color={COLORS.tan}>
                                <Fn name="tan" /> = <Frac n="o" d="a" color={COLORS.tan} />
                            </Card>
                        </div>

                        {/* RECIPROCAL IDENTITIES */}
                        <Category title="Reciprocal Identities" level="Basic" />
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <Card color={COLORS.csc}>
                                <Fn name="csc" /> = <Frac n="1" d={<Fn name="sin" />} />
                            </Card>
                            <Card color={COLORS.sec}>
                                <Fn name="sec" /> = <Frac n="1" d={<Fn name="cos" />} />
                            </Card>
                            <Card color={COLORS.cot}>
                                <Fn name="cot" /> = <Frac n="1" d={<Fn name="tan" />} />
                            </Card>
                        </div>

                        {/* RECIPROCALS ALTERNATE (directly beneath) */}
                        <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                            <Card color={COLORS.sin}>
                                <Fn name="sin" /> = <Frac n="1" d={<Fn name="csc" />} />
                            </Card>
                            <Card color={COLORS.cos}>
                                <Fn name="cos" /> = <Frac n="1" d={<Fn name="sec" />} />
                            </Card>
                            <Card color={COLORS.tan}>
                                <Fn name="tan" /> = <Frac n="1" d={<Fn name="cot" />} />
                            </Card>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 italic">
                            Flip the fraction upside down
                        </p>
                    </>
                )}

                {/* ============ INTERMEDIATE LEVEL ============ */}
                {show('intermediate') && (
                    <>
                        {/* QUOTIENT IDENTITIES */}
                        <Category title="Quotient Identities" level="Intermediate" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Card color={COLORS.tan}>
                                <Fn name="tan" /> = <Frac n={<Fn name="sin" />} d={<Fn name="cos" />} />
                            </Card>
                            <Card color={COLORS.cot}>
                                <Fn name="cot" /> = <Frac n={<Fn name="cos" />} d={<Fn name="sin" />} />
                            </Card>
                        </div>

                        {/* PYTHAGOREAN IDENTITIES */}
                        <Category title="Pythagorean Identities" level="Intermediate" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" sup="²" />θ + <Fn name="cos" sup="²" />θ = 1
                            </Card>
                            <Card>
                                <Fn name="tan" sup="²" />θ + 1 = <Fn name="sec" sup="²" />θ
                            </Card>
                            <Card>
                                1 + <Fn name="cot" sup="²" />θ = <Fn name="csc" sup="²" />θ
                            </Card>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 italic">
                            From a² + b² = c² on the unit circle
                        </p>

                        {/* COMPLEMENTARY (CO-) IDENTITIES */}
                        <Category title='Complementary "co-" Identities' level="Intermediate" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" />θ = <Fn name="cos" />(90° − θ)
                            </Card>
                            <Card>
                                <Fn name="tan" />θ = <Fn name="cot" />(90° − θ)
                            </Card>
                            <Card>
                                <Fn name="sec" />θ = <Fn name="csc" />(90° − θ)
                            </Card>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 italic">
                            "co-" = complementary angle (90° − θ)
                        </p>
                    </>
                )}

                {/* ============ ADVANCED LEVEL ============ */}
                {show('advanced') && (
                    <>
                        {/* DOUBLE ANGLE */}
                        <Category title="Double Angle" level="Advanced" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" />2θ = 2<Fn name="sin" />θ<Fn name="cos" />θ
                            </Card>
                            <Card>
                                <Fn name="cos" />2θ = <Fn name="cos" sup="²" />θ − <Fn name="sin" sup="²" />θ
                            </Card>
                        </div>

                        {/* HALF ANGLE */}
                        <Category title="Half Angle" level="Advanced" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" /><Frac n="θ" d="2" /> = ±√<Frac n={<>1 − <Fn name="cos" />θ</>} d="2" />
                            </Card>
                            <Card>
                                <Fn name="cos" /><Frac n="θ" d="2" /> = ±√<Frac n={<>1 + <Fn name="cos" />θ</>} d="2" />
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
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

                {/* Render custom content for identities lesson, standard list for others */}
                {selectedLessonId === 'identities' ? (
                    <IdentitiesContent />
                ) : (
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
                )}
            </div>
        </div>
    );
};
