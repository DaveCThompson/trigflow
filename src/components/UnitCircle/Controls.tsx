
import React from 'react';
import { UnitCircleState } from './UnitCircleRenderer';

interface ControlsProps {
    angle: number;
    setAngle: (angle: number) => void;
    angleUnit: 'deg' | 'rad';
    setAngleUnit: (unit: 'deg' | 'rad') => void;
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
}

export const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
        {children}
    </div>
);

const Toggle: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
    color?: string;
    description?: string;
}> = ({ label, checked, onChange, color, description }) => (
    <label className="flex items-center mb-2 cursor-pointer select-none group">
        <div className="relative flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
            />
            {color && (
                <span
                    className="w-3 h-3 rounded-full mr-3 shadow-sm border border-black/10"
                    style={{ backgroundColor: color }}
                />
            )}
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                    {label}
                </span>
                {description && (
                    <span className="text-xs text-gray-400 font-normal">{description}</span>
                )}
            </div>
        </div>
    </label>
);

export const Controls: React.FC<ControlsProps> = ({
    angle, setAngle, angleUnit, setAngleUnit, toggles, setToggles
}) => {

    const toggle = (key: keyof UnitCircleState['toggles']) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Controls
                </h2>
                <button
                    onClick={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                    className="text-xs font-mono font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {angleUnit === 'deg' ? 'DEG' : 'RAD'}
                </button>
            </div>

            <ControlSection title={`Angle: ${angleUnit === 'deg' ? angle.toFixed(1) + '°' : (angle * Math.PI / 180).toFixed(2) + ' rad'}`}>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="0.1"
                    value={angle}
                    onChange={(e) => setAngle(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
                <div className="text-xs text-gray-400 text-center mt-2">
                    Drag slider or use circle
                </div>
            </ControlSection>

            <ControlSection title="Functions">
                <Toggle
                    label="Sine"
                    checked={toggles.sin}
                    onChange={() => toggle('sin')}
                    color="#e74c3c"
                />
                <Toggle
                    label="Tangent"
                    checked={toggles.tan}
                    onChange={() => toggle('tan')}
                    color="#e67e22"
                />
                <Toggle
                    label="Secant"
                    checked={toggles.sec}
                    onChange={() => toggle('sec')}
                    color="#8e44ad"
                />
            </ControlSection>

            <ControlSection title="Complementary Functions">
                <Toggle
                    label="Cosine"
                    checked={toggles.cos}
                    onChange={() => toggle('cos')}
                    color="#3498db"
                />
                <Toggle
                    label="Cotangent"
                    checked={toggles.cot}
                    onChange={() => toggle('cot')}
                    color="#27ae60"
                />
                <Toggle
                    label="Cosecant"
                    checked={toggles.csc}
                    onChange={() => toggle('csc')}
                    color="#f1c40f"
                />
            </ControlSection>

            <ControlSection title="Geometry">
                <Toggle
                    label="Complementary Angle"
                    checked={toggles.comp}
                    onChange={() => toggle('comp')}
                    color="#aaaaaa"
                />
                <Toggle
                    label="Geometric Tangent (P-S)"
                    checked={toggles.geoTan}
                    onChange={() => toggle('geoTan')}
                    color="#e67e22"
                />
                <Toggle
                    label="Geometric Cotangent (P-C)"
                    checked={toggles.geoCot}
                    onChange={() => toggle('geoCot')}
                    color="#27ae60"
                />
                <Toggle
                    label="Similar Triangle (Sec)"
                    checked={toggles.similarSec}
                    onChange={() => toggle('similarSec')}
                    color="#8e44ad"
                    description="O-P-S"
                />
                <Toggle
                    label="Similar Triangle (Csc)"
                    checked={toggles.similarCsc}
                    onChange={() => toggle('similarCsc')}
                    color="#f1c40f"
                    description="O-P-C"
                />
                <Toggle
                    label="Hypotenuse (1)"
                    checked={toggles.hypotenuse}
                    onChange={() => toggle('hypotenuse')}
                    color="#000000"
                />
                <Toggle
                    label="Show Quadrants"
                    checked={toggles.quadrants}
                    onChange={() => toggle('quadrants')}
                    description="I, II, III, IV"
                />
            </ControlSection>
        </div>
    );
};
