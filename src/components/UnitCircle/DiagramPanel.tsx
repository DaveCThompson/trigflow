import React from 'react';
import { UnitCircleState } from '../../types';
import {
    TangentProofStepper,
    GeneralProofStepper,
    PythagoreanStepper,
    PythagIdentity1Stepper,
    PythagIdentity2Stepper,
    PythagIdentity3Stepper
} from './steppers';

export type DiagramType =
    | 'none'
    | 'general_form'
    | 'pythagorean'
    | 'pythagorean_identity'
    | 'tangent_identity'
    | 'pythag_identity_1'
    | 'pythag_identity_2'
    | 'pythag_identity_3';

interface DiagramPanelProps {
    type: DiagramType;
    setToggles?: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
}

export const DiagramPanel: React.FC<DiagramPanelProps> = ({ type, setToggles }) => {
    if (type === 'none') return null;

    return (
        <div className="w-full h-full bg-ui-bg-panel rounded-3xl shadow-soft border border-ui-border p-6 flex flex-col items-center justify-center transition-colors duration-300">
            {type === 'general_form' && (
                <GeneralProofStepper setToggles={setToggles} />
            )}

            {type === 'pythagorean' && (
                <PythagoreanStepper setToggles={setToggles} />
            )}

            {type === 'tangent_identity' && (
                <TangentProofStepper setToggles={setToggles} />
            )}

            {/* New split Pythagorean identity lessons */}
            {(type === 'pythagorean_identity' || type === 'pythag_identity_1') && (
                <PythagIdentity1Stepper setToggles={setToggles} />
            )}

            {type === 'pythag_identity_2' && (
                <PythagIdentity2Stepper setToggles={setToggles} />
            )}

            {type === 'pythag_identity_3' && (
                <PythagIdentity3Stepper setToggles={setToggles} />
            )}
        </div>
    );
};
