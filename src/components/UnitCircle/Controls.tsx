import React from 'react';
import { UnitCircleState } from '../../types';
import { Toggle } from '../shared/Toggle';
import { ControlSection } from '../shared/ControlSection';
import { ArrowCounterClockwise, Gear } from '@phosphor-icons/react';
import { Button } from '../shared/Button';

interface ControlsProps {
    angle: number;  // For Special Angles display
    angleUnit: 'deg' | 'rad';  // For Special Angles display
    setAngle: (angle: number) => void;  // For Special Angles preset buttons
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    theme: UnitCircleState['theme'];
    onResetToggles: () => void;
    /** List of toggle controls that should be visible. If undefined, all controls are shown. */
    visibleControls?: (keyof UnitCircleState['toggles'])[];
}

export const Controls: React.FC<ControlsProps> = ({
    angle, angleUnit, setAngle, toggles, setToggles, theme, onResetToggles, visibleControls
}) => {

    const toggle = (key: keyof UnitCircleState['toggles']) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper function to check if a control should be visible
    const isVisible = (key: keyof UnitCircleState['toggles']) => {
        return !visibleControls || visibleControls.includes(key);
    };

    // Helper function to check if a section has any visible toggles
    const hasSectionVisibleToggles = (toggleKeys: (keyof UnitCircleState['toggles'])[]) => {
        if (!visibleControls) return true; // All visible if no filter
        return toggleKeys.some(key => visibleControls.includes(key));
    };

    // Check if any toggles are visible at all
    const hasAnyVisibleToggles = !visibleControls || visibleControls.length > 0;

    return (
        <div className="w-full bg-ui-bg-panel rounded-3xl shadow-soft border border-ui-border p-6 transition-colors duration-300">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-ui-border">
                <div className="flex items-center gap-2 text-ui-text">
                    <Gear weight="duotone" className="text-xl text-ui-text-muted" />
                    <h2 className="text-xl font-heading font-extrabold">
                        Controls
                    </h2>
                </div>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onResetToggles}
                    title="Reset all toggles"
                    icon={<ArrowCounterClockwise weight="bold" />}
                />
            </div>

            <ControlSection title="Special Angles">
                <div className="grid grid-cols-5 gap-3 p-1">
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
                                        ? 'bg-surface-selected text-surface-selected-text ring-2 ring-border-selected shadow-lg'
                                        : 'bg-ui-bg-hover text-ui-text-muted hover:bg-ui-bg-hover hover:text-ui-text'
                                    }
                                `}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </ControlSection>

            {/* Empty State for lessons with no visible toggles (e.g., proof lessons) */}
            {!hasAnyVisibleToggles && (
                <div className="py-8 text-center space-y-2">
                    <p className="text-ui-text-muted text-sm">
                        <strong className="block text-base mb-2">👁️ Observe Mode</strong>
                        This lesson uses a dedicated visualization panel.
                        <br />
                        Use the canvas controls above to interact with the angle.
                    </p>
                </div>
            )}

            {/* Smart Sections: Only show if section has visible toggles */}
            {hasSectionVisibleToggles(['hypotenuse', 'quadrants', 'showXY', 'axesIntersections']) && (
                <ControlSection title="Foundational" defaultExpanded={true}>
                    {isVisible('hypotenuse') && (
                        <Toggle
                            label="Radius (Hypotenuse)"
                            checked={toggles.hypotenuse}
                            onChange={() => toggle('hypotenuse')}
                            color={theme.axis}
                            description="Unit length = 1"
                        />
                    )}
                    {isVisible('quadrants') && (
                        <Toggle
                            label="Quadrant Labels"
                            checked={toggles.quadrants}
                            onChange={() => toggle('quadrants')}
                            color={theme.text}
                            description="Shows I, II, III, IV"
                        />
                    )}
                    {isVisible('showXY') && (
                        <Toggle
                            label="Point Coordinates"
                            checked={toggles.showXY}
                            onChange={() => toggle('showXY')}
                            color={theme.text}
                            description="Shows (x, y) at point"
                        />
                    )}
                    {isVisible('axesIntersections') && (
                        <Toggle
                            label="Axis Intersections"
                            checked={toggles.axesIntersections}
                            onChange={() => toggle('axesIntersections')}
                            color={theme.text}
                            description="(1,0), (0,1), (-1,0), (0,-1)"
                        />
                    )}
                </ControlSection>
            )}

            {hasSectionVisibleToggles(['sin', 'cos', 'tan']) && (
                <ControlSection title="Basic Trig Functions" defaultExpanded={true}>
                    {isVisible('sin') && (
                        <Toggle
                            label="Sine"
                            checked={toggles.sin}
                            onChange={() => toggle('sin')}
                            color={theme.sin}
                        />
                    )}
                    {isVisible('cos') && (
                        <Toggle
                            label="Cosine"
                            checked={toggles.cos}
                            onChange={() => toggle('cos')}
                            color={theme.cos}
                        />
                    )}
                    {isVisible('tan') && (
                        <Toggle
                            label="Tangent"
                            checked={toggles.tan}
                            onChange={() => toggle('tan')}
                            color={theme.tan}
                        />
                    )}
                </ControlSection>
            )}

            {hasSectionVisibleToggles(['cot', 'csc', 'sec']) && (
                <ControlSection title="Other Functions" defaultExpanded={false}>
                    {isVisible('cot') && (
                        <Toggle
                            label="Cotangent"
                            checked={toggles.cot}
                            onChange={() => toggle('cot')}
                            color={theme.cot}
                        />
                    )}
                    {isVisible('csc') && (
                        <Toggle
                            label="Cosecant"
                            checked={toggles.csc}
                            onChange={() => toggle('csc')}
                            color={theme.csc}
                        />
                    )}
                    {isVisible('sec') && (
                        <Toggle
                            label="Secant"
                            checked={toggles.sec}
                            onChange={() => toggle('sec')}
                            color={theme.sec}
                        />
                    )}
                </ControlSection>
            )}

            <ControlSection title="Advanced Geometry" defaultExpanded={false}>
                {isVisible('comp') && (
                    <Toggle
                        label="Complementary Angle (α)"
                        checked={toggles.comp}
                        onChange={() => toggle('comp')}
                        color={theme.comp}
                        description="Shows 90° - θ relationship"
                    />
                )}
                {isVisible('geoTan') && (
                    <Toggle
                        label="Tangent Construction"
                        checked={toggles.geoTan}
                        onChange={() => toggle('geoTan')}
                        color={theme.tan}
                        description="Line from point to x=1"
                    />
                )}
                {isVisible('geoCot') && (
                    <Toggle
                        label="Cotangent Construction"
                        checked={toggles.geoCot}
                        onChange={() => toggle('geoCot')}
                        color={theme.cot}
                        description="Line from point to y=1"
                    />
                )}
                {isVisible('similarSec') && (
                    <Toggle
                        label="Secant Triangle"
                        checked={toggles.similarSec}
                        onChange={() => toggle('similarSec')}
                        color={theme.sec}
                        description="Similar triangle visualization"
                    />
                )}
                {isVisible('similarCsc') && (
                    <Toggle
                        label="Cosecant Triangle"
                        checked={toggles.similarCsc}
                        onChange={() => toggle('similarCsc')}
                        color={theme.csc}
                        description="Similar triangle visualization"
                    />
                )}
            </ControlSection>
        </div>
    );
};
