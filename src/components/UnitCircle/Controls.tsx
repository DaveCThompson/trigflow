
import React from 'react';
import { UnitCircleState } from './UnitCircleRenderer';
import { Toggle } from '../shared/Toggle';
import { ControlSection } from '../shared/ControlSection';

interface ControlsProps {
    angle: number;
    setAngle: (angle: number) => void;
    angleUnit: 'deg' | 'rad';
    setAngleUnit: (unit: 'deg' | 'rad') => void;
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

// ControlSection and Toggle are now imported from shared components

export const Controls: React.FC<ControlsProps> = ({
    angle, setAngle, angleUnit, setAngleUnit, toggles, setToggles, isPlaying, setIsPlaying
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
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`
                            flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg
                            transition-colors
                            ${isPlaying
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }
                        `}
                        title={isPlaying ? 'Pause animation' : 'Play animation'}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        step="0.1"
                        value={angle}
                        onChange={(e) => setAngle(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        disabled={isPlaying}
                    />
                </div>
            </ControlSection>

            <ControlSection title="Special Angles">
                <div className="grid grid-cols-5 gap-2">
                    {[0, 30, 45, 60, 90].map(deg => {
                        const isActive = Math.abs(angle - deg) < 0.1;

                        let label = `${deg}°`;
                        if (angleUnit === 'rad') {
                            switch (deg) {
                                case 0: label = "0"; break;
                                case 30: label = "π/6"; break;
                                case 45: label = "π/4"; break;
                                case 60: label = "π/3"; break;
                                case 90: label = "π/2"; break;
                            }
                        }

                        return (
                            <button
                                key={deg}
                                onClick={() => setAngle(deg)}
                                className={`
                                    text-sm font-medium py-2 rounded transition-colors
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                {label}
                            </button>
                        );
                    })}
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
                    color="#6b7280"
                    description="I, II, III, IV"
                />
                <Toggle
                    label="Show (x, y)"
                    checked={toggles.showXY}
                    onChange={() => toggle('showXY')}
                    color="#64748b"
                    description="Coordinates on point"
                />
                <Toggle
                    label="Axes Points"
                    checked={toggles.axesIntersections}
                    onChange={() => toggle('axesIntersections')}
                    color="#94a3b8"
                    description="(1,0), (0,1), (-1,0), (0,-1)"
                />
            </ControlSection>
        </div>
    );
};
