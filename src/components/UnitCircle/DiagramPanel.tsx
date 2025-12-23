import React from 'react';
import { TangentProofStepper, GeneralProofStepper, PythagoreanStepper } from './steppers';

export type DiagramType = 'none' | 'general_form' | 'pythagorean' | 'pythagorean_identity' | 'tangent_identity';

interface DiagramPanelProps {
    type: DiagramType;
    setToggles?: React.Dispatch<React.SetStateAction<any>>;
}

export const DiagramPanel: React.FC<DiagramPanelProps> = ({ type, setToggles }) => {
    if (type === 'none') return null;

    return (
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center justify-center">
            {type === 'general_form' && (
                <GeneralProofStepper setToggles={setToggles} />
            )}

            {(type === 'pythagorean' || type === 'pythagorean_identity') && (
                <PythagoreanStepper setToggles={setToggles} />
            )}

            {type === 'tangent_identity' && (
                <TangentProofStepper setToggles={setToggles} />
            )}
        </div>
    );
};
