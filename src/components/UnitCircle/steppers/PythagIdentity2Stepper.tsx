/**
 * PythagIdentity2Stepper - Algebraic derivation for tan²θ + 1 = sec²θ
 * Shows how this identity is derived by dividing the fundamental identity by cos²θ.
 */

import React from 'react';
import { AlgebraicStepper, AlgebraicStep } from './AlgebraicStepper';

import { UnitCircleState } from '../../../types';

interface PythagIdentity2StepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
}

// Styled function names matching the color theme
const Sin = () => <span className="text-red-500">sin</span>;
const Cos = () => <span className="text-blue-500">cos</span>;
const Tan = () => <span className="text-orange-500">tan</span>;
const Sec = () => <span className="text-purple-500">sec</span>;

// Fraction component
const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode }> = ({ n, d }) => (
    <span className="inline-flex flex-col items-center mx-1 leading-tight">
        <span className="text-base">{n}</span>
        <span className="w-full border-t border-current" style={{ marginTop: '2px', marginBottom: '2px' }} />
        <span className="text-base">{d}</span>
    </span>
);

const STEPS: AlgebraicStep[] = [
    {
        title: "Step 1: Start with the Fundamental Identity",
        description: "We begin with sin²θ + cos²θ = 1",
        equation: (
            <span>
                <Sin />²θ + <Cos />²θ = 1
            </span>
        ),
        highlight: 'start'
    },
    {
        title: "Step 2: Divide Everything by cos²θ",
        description: "Divide each term by cos²θ:",
        equation: (
            <span className="flex items-center justify-center gap-1">
                <Frac n={<><Sin />²θ</>} d={<><Cos />²θ</>} />
                +
                <Frac n={<><Cos />²θ</>} d={<><Cos />²θ</>} />
                =
                <Frac n="1" d={<><Cos />²θ</>} />
            </span>
        ),
        highlight: 'intermediate'
    },
    {
        title: "Step 3: Simplify Using Definitions",
        description: "sin/cos = tan and 1/cos = sec:",
        equation: (
            <span className="flex items-center justify-center gap-1">
                <Tan />²θ + 1 = <Sec />²θ
            </span>
        ),
        highlight: 'intermediate'
    },
    {
        title: "Result: Second Pythagorean Identity",
        description: "The tangent-secant relationship:",
        equation: (
            <span>
                <Tan />²θ + 1 = <Sec />²θ
            </span>
        ),
        highlight: 'result'
    }
];

export const PythagIdentity2Stepper: React.FC<PythagIdentity2StepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles: Partial<UnitCircleState['toggles']> = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false,
            proof_pythag_squares: false, proof_pythag_rearrange: false
        };

        // Show tan/sec visualization for later steps
        if (step <= 1) {
            setToggles(prev => ({
                ...prev,
                ...resetToggles,
                sin: true,
                cos: true,
                hypotenuse: true
            }));
        } else {
            setToggles(prev => ({
                ...prev,
                ...resetToggles,
                tan: true,
                sec: true,
                hypotenuse: true,
                geoTan: true
            }));
        }
    }, [step, setToggles]);

    return (
        <AlgebraicStepper
            title="Pythagorean Identity #2"
            subtitle="Derived by dividing by cos²θ"
            steps={STEPS}
            step={step}
            setStep={setStep}
            accentColor="#f59e0b" // Amber for tan/sec
        />
    );
};
