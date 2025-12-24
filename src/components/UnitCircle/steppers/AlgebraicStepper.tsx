/**
 * AlgebraicStepper - Reusable base component for step-through equation derivations.
 * Used for Pythagorean identity lessons and other algebraic proofs.
 */

import React from 'react';

export interface AlgebraicStep {
    title: string;
    description?: string;
    equation?: React.ReactNode;
    highlight?: 'result' | 'intermediate' | 'start';
}

interface AlgebraicStepperProps {
    title: string;
    subtitle?: string;
    steps: AlgebraicStep[];
    step: number;
    setStep: (step: number) => void;
    accentColor?: string;
}

/**
 * A reusable stepper component for showing algebraic derivations.
 * Each step shows a title, optional description, and equation.
 */
export const AlgebraicStepper: React.FC<AlgebraicStepperProps> = ({
    title,
    subtitle,
    steps,
    step,
    setStep,
    accentColor = '#3b82f6' // Default blue
}) => {
    const currentStep = steps[step] || steps[0];
    const maxStep = steps.length - 1;

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
            {subtitle && (
                <p className="text-xs text-gray-500 text-center mb-4">{subtitle}</p>
            )}

            {/* Step Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        {currentStep.title}
                    </p>
                    {currentStep.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                            {currentStep.description}
                        </p>
                    )}
                    {currentStep.equation && (
                        <div
                            className={`text-xl font-serif font-bold mt-3 ${currentStep.highlight === 'result'
                                    ? 'text-emerald-500'
                                    : currentStep.highlight === 'intermediate'
                                        ? 'text-amber-500'
                                        : 'text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            {currentStep.equation}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 px-2">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-1 items-center">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-opacity-100' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            style={{ backgroundColor: i === step ? accentColor : undefined }}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setStep(Math.min(maxStep, step + 1))}
                    disabled={step === maxStep}
                    className="px-4 py-2 rounded-lg text-white disabled:opacity-50 font-medium transition-colors shadow-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
