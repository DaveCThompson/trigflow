import React from 'react';
import { PythagoreanProofCanvas } from '../PythagoreanProofCanvas';
import { UnitCircleState } from '../../../types';

interface PythagoreanStepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
}

export const PythagoreanStepper: React.FC<PythagoreanStepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(1);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles: Partial<UnitCircleState['toggles']> = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false,
            proof_pythag_squares: false, proof_pythag_rearrange: true, pythagStep: step
        };

        setToggles(prev => ({ ...prev, ...resetToggles }));
    }, [step, setToggles]);

    const stepContent = [
        {
            title: "Step 1: The Setup",
            description: "A large square of side (a + b) with 4 identical right triangles at the corners.",
        },
        {
            title: "Step 2: Configuration 1",
            description: "The 4 triangles surround an inner tilted square. This inner square has side c (the hypotenuse).",
            equation: "Area = c²"
        },
        {
            title: "Step 3: Rearrange!",
            description: "Same outer square, same 4 triangles — but rearranged to reveal TWO axis-aligned squares.",
            equation: "Area = a² + b²"
        },
        {
            title: "Conclusion",
            description: "Since the remaining area must be equal:",
            equation: "a² + b² = c²"
        },
    ];

    const current = stepContent[step - 1] || stepContent[0];

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">Pythagorean Theorem</h3>
            <p className="text-xs text-gray-500 text-center mb-4">Visual Rearrangement Proof</p>

            {/* Canvas */}
            <div className="flex justify-center mb-4">
                <PythagoreanProofCanvas step={step} width={280} height={280} />
            </div>

            {/* Step Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="font-semibold text-gray-600 dark:text-gray-300">{current.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-2">
                        {current.description}
                    </p>
                    {current.equation && (
                        <div className="text-xl font-serif font-bold text-emerald-500 mt-2">
                            {current.equation}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    disabled={step === 4}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
