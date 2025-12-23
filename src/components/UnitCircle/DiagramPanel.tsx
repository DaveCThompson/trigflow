import React from 'react';

export type DiagramType = 'none' | 'general_form' | 'pythagorean' | 'tangent_identity' | 'pythagorean_identity';

interface DiagramPanelProps {
    type: DiagramType;
    setToggles?: React.Dispatch<React.SetStateAction<any>>; // Using any for simplicity or import UnitCircleState
}

export const DiagramPanel: React.FC<DiagramPanelProps> = ({ type, setToggles }) => {
    if (type === 'none') return null;

    return (
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center justify-center">
            {type === 'general_form' && (
                <GeneralProofStepper setToggles={setToggles} />
            )}

            {type === 'pythagorean' && (
                <PythagoreanGeneralStepper setToggles={setToggles} />
            )}

            {type === 'pythagorean_identity' && (
                <PythagoreanIdentityStepper setToggles={setToggles} />
            )}

            {type === 'tangent_identity' && (
                <TangentProofStepper setToggles={setToggles} />
            )}
        </div>
    );
};

function TangentProofStepper({ setToggles }: { setToggles?: React.Dispatch<React.SetStateAction<any>> }) {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false, proof_pythag_squares: false, proof_pythag_general: false
        };

        if (step === 0) {
            // Step 0: Sine Triangle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_sin_tri: true, proof_tan_tri: false }));
        } else if (step === 1) {
            // Step 1: Tangent Triangle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_sin_tri: false, proof_tan_tri: true }));
        } else if (step === 2) {
            // Step 2: Comparison
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_sin_tri: true, proof_tan_tri: true }));
        }
    }, [step, setToggles]);

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">Tangent Identity Proof</h3>

            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                {step === 0 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 1: The Sine Triangle</p>
                        <p className="text-sm text-gray-500 text-left px-4">
                            • Hypotenuse is <span className="font-bold text-gray-800 dark:text-gray-200">1</span>.<br />
                            • Vertical side is <span className="text-red-500 font-bold">sin θ</span>.<br />
                            • Horizontal side is <span className="text-blue-500 font-bold">cos θ</span>.
                        </p>
                    </div>
                )}
                {step === 1 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 2: The Tangent Triangle</p>
                        <p className="text-sm text-gray-500 text-left px-4">
                            • Bottom side is <span className="font-bold text-gray-800 dark:text-gray-200">1</span>.<br />
                            • Vertical part is <span className="text-orange-500 font-bold">tan θ</span>.
                        </p>
                    </div>
                )}
                {step === 2 && (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 3: Similar Triangles</p>

                        <div className="flex flex-col gap-4 items-center justify-center">
                            {/* Initial Ratio Equation */}
                            <div className="flex items-center gap-3 text-xl font-serif">
                                <div className="flex flex-col items-center">
                                    <span className="text-red-500 border-b border-gray-400 px-1">sin</span>
                                    <span className="text-blue-500 px-1">cos</span>
                                </div>
                                <span className="text-gray-400">=</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-orange-500 border-b border-gray-400 px-1">tan</span>
                                    <span className="text-gray-800 dark:text-gray-200 px-1">1</span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="text-gray-400">↓</div>

                            {/* Simplified Equation */}
                            <div className="text-2xl font-serif font-bold">
                                <span className="text-orange-500">tan</span>
                                <span className="text-gray-400 mx-2">=</span>
                                <span className="inline-flex flex-col items-center align-middle">
                                    <span className="text-red-500 border-b-2 border-gray-400 px-1 text-base">sin</span>
                                    <span className="text-blue-500 px-1 text-base">cos</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(2, step + 1))}
                    disabled={step === 2}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function GeneralProofStepper({ setToggles }: { setToggles?: React.Dispatch<React.SetStateAction<any>> }) {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        // Reset
        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false, proof_pythag_squares: false, proof_pythag_general: false
        };

        if (step === 0) {
            // Step 1: Unit Circle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_general_unit: true }));
        } else if (step === 1) {
            // Step 2: General Triangle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_general_unit: true, proof_general_target: true }));
        } else if (step === 2) {
            // Step 3: Comparison
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_general_unit: true, proof_general_target: true }));
        }
    }, [step, setToggles]);

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">General Form Proof</h3>

            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                {step === 0 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 1: The Unit Circle</p>
                        <p className="text-sm text-gray-500 px-4">
                            In the unit circle, the Hypotenuse is <b>1</b>.
                        </p>
                        <div className="text-xl font-serif">
                            sin θ = <span className="text-red-500 font-bold">Opp</span> / <span className="text-gray-800 dark:text-gray-200 font-bold">1</span>
                        </div>
                    </div>
                )}
                {step === 1 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 2: Any Right Triangle</p>
                        <p className="text-sm text-gray-500 px-4">
                            Scale the triangle up by any factor. We label the sides <b>Opp</b>, <b>Adj</b>, and <b>Hyp</b>.
                        </p>
                    </div>
                )}
                {step === 2 && (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 3: Ratios</p>
                        <div className="flex flex-col gap-4 items-center justify-center">
                            <p className="text-sm text-gray-500">Because the triangles are similar, the ratios of corresponding sides are equal.</p>

                            <div className="text-2xl font-serif font-bold">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-red-500 border-b border-gray-400 px-1">sin</span>
                                        <span className="text-gray-800 dark:text-gray-200 px-1">1</span>
                                    </div>
                                    <span className="text-gray-400">=</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-orange-500 border-b border-gray-400 px-1">Opp</span>
                                        <span className="text-gray-600 dark:text-gray-400 px-1">Hyp</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-base font-serif text-blue-600 dark:text-blue-400 mt-2">
                                ∴ sin θ = Opp / Hyp
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(2, step + 1))}
                    disabled={step === 2}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function PythagoreanGeneralStepper({ setToggles }: { setToggles?: React.Dispatch<React.SetStateAction<any>> }) {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        // Reset
        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false,
            proof_pythag_squares: false, proof_pythag_general: false
        };

        if (step === 0) {
            // Step 1: General Triangle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_pythag_general: true }));
        } else if (step === 1) {
            // Step 2: Squares
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_pythag_general: true }));
        } else if (step === 2) {
            // Step 3: Equality
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_pythag_general: true }));
        }
    }, [step, setToggles]);

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">Pythagorean Theorem</h3>

            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                <div className="text-center space-y-4">
                    {step === 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="font-semibold text-gray-600 dark:text-gray-300">Step 1: The Right Triangle</p>
                            <p className="text-sm text-gray-500 px-4 mt-2">
                                For any right triangle with sides <b>a</b>, <b>b</b>, and hypotenuse <b>c</b>.
                            </p>
                        </div>
                    )}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="font-semibold text-gray-600 dark:text-gray-300">Step 2: Squaring Sides</p>
                            <p className="text-sm text-gray-500 px-4 mt-2">
                                We can construct squares on each side of the triangle.
                            </p>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="font-semibold text-gray-600 dark:text-gray-300">Step 3: The Equality</p>
                            <p className="text-sm text-gray-500 px-4 mt-2">
                                The area of the square on the hypotenuse equals the sum of the areas of the other two squares.
                            </p>
                            <div className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200 pt-4">
                                a² + b² = c²
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(2, step + 1))}
                    disabled={step === 2}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function PythagoreanIdentityStepper({ setToggles }: { setToggles?: React.Dispatch<React.SetStateAction<any>> }) {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false, proof_pythag_squares: false, proof_pythag_general: false
        };

        if (step === 0) {
            // Step 1: The Triangle
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true }));
        } else if (step === 1) {
            // Step 2: The Squares
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true, proof_pythag_squares: true }));
        } else if (step === 2) {
            // Step 3: The Equation
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true, proof_pythag_squares: true }));
        }
    }, [step, setToggles]);

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">Pythagorean Identity</h3>

            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                {step === 0 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 1: Right Triangle</p>
                        <p className="text-sm text-gray-500 px-4">
                            In a right triangle with Hypotenuse 1.
                        </p>
                    </div>
                )}
                {step === 1 && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 2: Areas</p>
                        <p className="text-sm text-gray-500 px-4">
                            Construct squares on each side.<br />
                            Area <span className="text-blue-500 font-bold">a²</span> + Area <span className="text-red-500 font-bold">b²</span>
                        </p>
                    </div>
                )}
                {step === 2 && (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Step 3: Identity</p>
                        <div className="flex flex-col gap-4 items-center justify-center">
                            <div className="text-3xl font-serif font-bold text-gray-800 dark:text-gray-200">
                                a² + b² = c²
                            </div>
                            <div className="h-px w-32 bg-gray-300 my-2"></div>
                            <div className="text-xl font-serif">
                                <span className="text-blue-500 font-bold">cos²θ</span> + <span className="text-red-500 font-bold">sin²θ</span> = 1
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(2, step + 1))}
                    disabled={step === 2}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
