/**
 * PythagIdentity3Stepper - Algebraic derivation for 1 + cot²θ = csc²θ
 * Shows how this identity is derived by dividing the fundamental identity by sin²θ.
 */

import React from 'react';
import { AlgebraicStepper, AlgebraicStep } from './AlgebraicStepper';

interface PythagIdentity3StepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<any>>;
}

// Styled function names matching the color theme
const Sin = () => <span className="text-red-500">sin</span>;
const Cos = () => <span className="text-blue-500">cos</span>;
const Cot = () => <span className="text-green-500">cot</span>;
const Csc = () => <span className="text-yellow-500">csc</span>;

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
        title: "Step 2: Divide Everything by sin²θ",
        description: "Divide each term by sin²θ:",
        equation: (
            <span className="flex items-center justify-center gap-1">
                <Frac n={<><Sin />²θ</>} d={<><Sin />²θ</>} />
                +
                <Frac n={<><Cos />²θ</>} d={<><Sin />²θ</>} />
                =
                <Frac n="1" d={<><Sin />²θ</>} />
            </span>
        ),
        highlight: 'intermediate'
    },
    {
        title: "Step 3: Simplify Using Definitions",
        description: "cos/sin = cot and 1/sin = csc:",
        equation: (
            <span className="flex items-center justify-center gap-1">
                1 + <Cot />²θ = <Csc />²θ
            </span>
        ),
        highlight: 'intermediate'
    },
    {
        title: "Result: Third Pythagorean Identity",
        description: "The cotangent-cosecant relationship:",
        equation: (
            <span>
                1 + <Cot />²θ = <Csc />²θ
            </span>
        ),
        highlight: 'result'
    }
];

export const PythagIdentity3Stepper: React.FC<PythagIdentity3StepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        const resetToggles = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false,
            proof_pythag_squares: false, proof_pythag_rearrange: false
        };

        // Show cot/csc visualization for later steps
        if (step <= 1) {
            setToggles((prev: any) => ({
                ...prev,
                ...resetToggles,
                sin: true,
                cos: true,
                hypotenuse: true
            }));
        } else {
            setToggles((prev: any) => ({
                ...prev,
                ...resetToggles,
                cot: true,
                csc: true,
                hypotenuse: true,
                geoCot: true
            }));
        }
    }, [step, setToggles]);

    return (
        <AlgebraicStepper
            title="Pythagorean Identity #3"
            subtitle="Derived by dividing by sin²θ"
            steps={STEPS}
            step={step}
            setStep={setStep}
            accentColor="#22c55e" // Green for cot/csc
        />
    );
};
