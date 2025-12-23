import React from 'react';

interface GeneralProofStepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<any>>;
}

export const GeneralProofStepper: React.FC<GeneralProofStepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false, proof_pythag_squares: false
        };

        if (step === 0) {
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_general_unit: true }));
        } else if (step === 1) {
            setToggles((prev: any) => ({ ...prev, ...resetToggles, proof_general_unit: true, proof_general_target: true }));
        } else if (step === 2) {
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
};
