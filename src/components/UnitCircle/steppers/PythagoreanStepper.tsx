import React from 'react';

interface PythagoreanStepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<any>>;
}

export const PythagoreanStepper: React.FC<PythagoreanStepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false, proof_pythag_squares: false
        };

        if (step === 0) {
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true }));
        } else if (step === 1) {
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true, proof_pythag_squares: true }));
        } else if (step === 2) {
            setToggles((prev: any) => ({ ...prev, ...resetToggles, sin: true, cos: true, hypotenuse: true, proof_pythag_squares: true }));
        }
    }, [step, setToggles]);

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center">Pythagorean Theorem</h3>

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
