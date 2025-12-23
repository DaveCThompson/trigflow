import React, { useEffect } from 'react';
import { UnitCircleState } from './UnitCircleRenderer';

interface LessonPanelProps {
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    setAngle: (angle: number) => void;
}

type LessonId = 'unit_circle' | 'sine' | 'cosine' | 'tangent' | 'secant';

interface LessonData {
    id: LessonId;
    title: string;
    quote: React.ReactNode;
    details: React.ReactNode[];
    apply: (setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>) => void;
}

const LESSONS: LessonData[] = [
    {
        id: 'unit_circle',
        title: 'Unit Circle',
        quote: <span className="text-xl font-light">The foundation of trigonometry.</span>,
        details: [
            "A circle with a radius of exactly 1.",
            "Centered at the origin (0,0) of the Cartesian plane."
        ],
        apply: (set) => set(prev => ({
            ...prev,
            sin: true, cos: true, tan: false, cot: false, sec: false, csc: false,
            hypotenuse: true, quadrants: false, geoTan: false, geoCot: false, similarSec: false, similarCsc: false
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
            "Maximum at 90° (1)."
        ],
        apply: (set) => set(prev => ({
            ...prev,
            sin: true, cos: false, tan: false, cot: false, sec: false, csc: false,
            quadrants: true,
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
            "Maximum at 0° (1)."
        ],
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: true, tan: false, cot: false, sec: false, csc: false,
            quadrants: true,
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
            "Ideally shown as the segment on the line x=1."
        ],
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: false, tan: true, cot: false, sec: false, csc: false,
            geoTan: true, // Show geometric tangent line
            hypotenuse: true, quadrants: false, similarSec: false, similarCsc: false
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
            "Range: (-∞, -1] U [1, ∞)",
            "The hypotenuse of the triangle formed by the tangent."
        ],
        apply: (set) => set(prev => ({
            ...prev,
            sin: false, cos: false, tan: false, cot: false, sec: true, csc: false,
            similarSec: true, // Show similar triangle
            hypotenuse: true, quadrants: false, geoTan: true, geoCot: false, similarCsc: false
        }))
    }
];

export const LessonPanel: React.FC<LessonPanelProps> = ({ toggles, setToggles }) => {
    // Simple self-contained state for the dropdown. 
    // Ideally this could be lifted if we wanted 'two-way' binding with the visuals returning to a lesson state, 
    // but for now, the lesson just APPLIES state.
    const [selectedId, setSelectedId] = React.useState<LessonId>('unit_circle');

    const handleSelect = (id: LessonId) => {
        setSelectedId(id);
        const lesson = LESSONS.find(l => l.id === id);
        if (lesson) {
            lesson.apply(setToggles);
        }
    };

    const currentLesson = LESSONS.find(l => l.id === selectedId) || LESSONS[0];

    return (
        <div className="w-full xl:w-[320px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6 h-fit sticky top-6">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Lessons
                </h2>
                <select
                    value={selectedId}
                    onChange={(e) => handleSelect(e.target.value as LessonId)}
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
