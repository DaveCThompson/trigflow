/**
 * PythagIdentity1Stepper - Algebraic derivation for sin²θ + cos²θ = 1
 * Shows how the fundamental Pythagorean identity follows from the unit circle.
 */

import React from 'react';
import { AlgebraicStepper, AlgebraicStep } from './AlgebraicStepper';

import { UnitCircleState } from '../../../types';

interface PythagIdentity1StepperProps {
    setToggles?: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
}

// Styled function names matching the color theme
const Sin = () => <span className="text-red-500">sin</span>;
const Cos = () => <span className="text-blue-500">cos</span>;

const STEPS: AlgebraicStep[] = [
    {
        title: "Step 1: The Unit Circle Triangle",
        description: "On the unit circle, a right triangle forms with hypotenuse = 1, vertical side = sin θ, horizontal side = cos θ.",
        highlight: 'start'
    },
    {
        title: "Step 2: Apply Pythagorean Theorem",
        description: "In any right triangle: a² + b² = c²",
        equation: <span>a² + b² = c²</span>,
        highlight: 'intermediate'
    },
    {
        title: "Step 3: Substitute",
        description: "Replace a with cos θ, b with sin θ, and c with 1:",
        equation: (
            <span>
                <Cos />²θ + <Sin />²θ = 1²
            </span>
        ),
        highlight: 'intermediate'
    },
    {
        title: "Step 4: Simplify",
        description: "The fundamental Pythagorean identity:",
        equation: (
            <span>
                <Sin />²θ + <Cos />²θ = 1
            </span>
        ),
        highlight: 'result'
    }
];

export const PythagIdentity1Stepper: React.FC<PythagIdentity1StepperProps> = ({ setToggles }) => {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        if (!setToggles) return;

        // Show the sine triangle visualization for this identity
        const resetToggles: Partial<UnitCircleState['toggles']> = {
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            similarSec: false, hypotenuse: false, quadrants: false, geoTan: false, geoCot: false, similarCsc: false,
            proof_sin_tri: false, proof_tan_tri: false, proof_general_unit: false, proof_general_target: false,
            proof_pythag_squares: false, proof_pythag_rearrange: false
        };

        // Show sin/cos/hypotenuse for steps 1+
        if (step >= 0) {
            setToggles(prev => ({
                ...prev,
                ...resetToggles,
                sin: true,
                cos: true,
                hypotenuse: true,
                proof_sin_tri: step >= 1 // Show labeled triangle from step 2
            }));
        }
    }, [step, setToggles]);

    return (
        <AlgebraicStepper
            title="Pythagorean Identity #1"
            subtitle="The fundamental identity from the unit circle"
            steps={STEPS}
            step={step}
            setStep={setStep}
            accentColor="#10b981" // Emerald for "fundamental"
        />
    );
};
