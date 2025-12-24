import React from 'react';
import { UnitCircleState } from '../../types';
import { Toggle } from '../shared/Toggle';
import { ControlSection } from '../shared/ControlSection';
import { ArrowCounterClockwise, PlayCircle, PauseCircle, Gear } from '@phosphor-icons/react';

interface ControlsProps {
    angle: number;
    setAngle: (angle: number) => void;
    angleUnit: 'deg' | 'rad';
    setAngleUnit: (unit: 'deg' | 'rad') => void;
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    theme: UnitCircleState['theme'];
    onResetToggles: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    angle, setAngle, angleUnit, setAngleUnit, toggles, setToggles, isPlaying, setIsPlaying, theme, onResetToggles
}) => {

    const toggle = (key: keyof UnitCircleState['toggles']) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full bg-ui-bg-panel rounded-3xl shadow-soft border border-ui-border p-6 transition-colors duration-300">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-ui-border">
                <div className="flex items-center gap-2 text-ui-text">
                    <Gear weight="duotone" className="text-xl text-ui-text-muted" />
                    <h2 className="text-xl font-heading font-extrabold">
                        Controls
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onResetToggles}
                        title="Reset all toggles"
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors active:scale-95"
                    >
                        <ArrowCounterClockwise weight="bold" />
                    </button>
                    <button
                        onClick={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                        className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-ui-bg-hover text-ui-text-muted hover:text-ui-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        {angleUnit === 'deg' ? 'DEG' : 'RAD'}
                    </button>
                </div>
            </div>

            <ControlSection title={`Angle: ${angleUnit === 'deg' ? angle.toFixed(1) + '°' : (angle * Math.PI / 180).toFixed(2) + ' rad'}`}>
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`
                            flex items-center justify-center p-0 rounded-full transition-all duration-300 hover:-translate-y-0.5
                            ${isPlaying ? 'text-ui-text opacity-50' : 'text-trig-cos shadow-glow'}
                        `}
                        title={isPlaying ? 'Pause animation' : 'Play animation'}
                        style={!isPlaying ? { boxShadow: '0 0 20px -5px oklch(75% 0.15 260 / 0.6)' } : undefined}
                    >
                        {isPlaying ? (
                            <PauseCircle size={42} weight="fill" />
                        ) : (
                            <PlayCircle size={42} weight="fill" />
                        )}
                    </button>

                    {/* Custom Range Slider */}
                    <div className="relative flex-1 h-8 flex items-center group">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="0.1"
                            value={angle}
                            onChange={(e) => setAngle(parseFloat(e.target.value))}
                            className="absolute w-full h-2 bg-ui-bg-hover rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-trig-cos/20"
                            disabled={isPlaying}
                            style={{
                                background: `linear-gradient(to right, var(--color-cos) 0%, var(--color-cos) ${(angle / 360) * 100}%, var(--surface-3) ${(angle / 360) * 100}%, var(--surface-3) 100%)`
                            }}
                        />
                        <style>{`
                            input[type=range]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                background: #ffffff;
                                border: 2px solid var(--color-cos);
                                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                                transition: transform 0.1s;
                                margin-top: -6px; /* center it? no, check h-2 is 8px */
                            }
                            input[type=range]::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                            }
                             input[type=range]::-moz-range-thumb {
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                background: #ffffff;
                                border: 2px solid var(--color-cos);
                                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                                transition: transform 0.1s;
                            }
                        `}</style>
                    </div>
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
                                    text-xs font-bold py-2 rounded-xl transition-all duration-200 active:scale-95
                                    ${isActive
                                        ? 'bg-white dark:bg-gray-800 ring-2 ring-trig-cos text-trig-cos shadow-lg shadow-trig-cos/20'
                                        : 'bg-ui-bg-hover text-ui-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-ui-text'
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
                    color={theme.sin}
                />
                <Toggle
                    label="Tangent"
                    checked={toggles.tan}
                    onChange={() => toggle('tan')}
                    color={theme.tan}
                />
                <Toggle
                    label="Secant"
                    checked={toggles.sec}
                    onChange={() => toggle('sec')}
                    color={theme.sec}
                />
            </ControlSection>

            <ControlSection title="Complementary Functions">
                <Toggle
                    label="Cosine"
                    checked={toggles.cos}
                    onChange={() => toggle('cos')}
                    color={theme.cos}
                />
                <Toggle
                    label="Cosine (Comp. Position)"
                    checked={toggles.cosOnCompSide ?? false}
                    onChange={() => toggle('cosOnCompSide')}
                    color={theme.cos}
                    description="Shows cos from point to Y-axis"
                />
                <Toggle
                    label="Cotangent"
                    checked={toggles.cot}
                    onChange={() => toggle('cot')}
                    color={theme.cot}
                />
                <Toggle
                    label="Cosecant"
                    checked={toggles.csc}
                    onChange={() => toggle('csc')}
                    color={theme.csc}
                />
            </ControlSection>

            <ControlSection title="Advanced Geometry" defaultExpanded={false}>
                <Toggle
                    label="Complementary Angle (α)"
                    checked={toggles.comp}
                    onChange={() => toggle('comp')}
                    color={theme.comp}
                    description="Shows 90° - θ relationship"
                />
                <Toggle
                    label="Tangent Construction"
                    checked={toggles.geoTan}
                    onChange={() => toggle('geoTan')}
                    color={theme.tan}
                    description="Line from point to x=1"
                />
                <Toggle
                    label="Cotangent Construction"
                    checked={toggles.geoCot}
                    onChange={() => toggle('geoCot')}
                    color={theme.cot}
                    description="Line from point to y=1"
                />
                <Toggle
                    label="Secant Triangle"
                    checked={toggles.similarSec}
                    onChange={() => toggle('similarSec')}
                    color={theme.sec}
                    description="Similar triangle visualization"
                />
                <Toggle
                    label="Cosecant Triangle"
                    checked={toggles.similarCsc}
                    onChange={() => toggle('similarCsc')}
                    color={theme.csc}
                    description="Similar triangle visualization"
                />
                <Toggle
                    label="Radius (Hypotenuse)"
                    checked={toggles.hypotenuse}
                    onChange={() => toggle('hypotenuse')}
                    color={theme.axis}
                    description="Unit length = 1"
                />
                <Toggle
                    label="Quadrant Labels"
                    checked={toggles.quadrants}
                    onChange={() => toggle('quadrants')}
                    color={theme.text}
                    description="Shows I, II, III, IV"
                />
                <Toggle
                    label="Point Coordinates"
                    checked={toggles.showXY}
                    onChange={() => toggle('showXY')}
                    color={theme.text}
                    description="Shows (x, y) at point"
                />
                <Toggle
                    label="Axis Intersections"
                    checked={toggles.axesIntersections}
                    onChange={() => toggle('axesIntersections')}
                    color={theme.text}
                    description="(1,0), (0,1), (-1,0), (0,-1)"
                />
            </ControlSection>
        </div>
    );
};
