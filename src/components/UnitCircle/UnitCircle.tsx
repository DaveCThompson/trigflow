
import React, { useState, useMemo, useCallback } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { drawUnitCircle, UnitCircleState } from './UnitCircleRenderer';
import { Controls } from './Controls';
import { LessonPanel } from './LessonPanel';
import { toRad, toDeg, normalizeAngle } from '../../utils/math';
import { TrigGraph } from '../TrigGraph';

// --- Readout Component ---
const ValueDisplay: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => {
    // Format helper
    const fmt = (n: number) => {
        if (Math.abs(n) > 1000) return n < 0 ? "-∞" : "+∞";
        // Fixed width for stability? " 0.000"
        return n.toFixed(3);
    };

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 font-mono text-sm">
            <span className="font-bold opacity-80" style={{ color }}>{label}</span>
            <span className="text-gray-600 dark:text-gray-400 tabular-nums">{fmt(value)}</span>
        </div>
    );
};

const ReadoutPanel: React.FC<{
    trigValues: { cos: number; sin: number; tan: number; cot: number; sec: number; csc: number; };
    toggles: UnitCircleState['toggles'];
    theme: UnitCircleState['theme'];
}> = ({ trigValues, toggles, theme }) => {
    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                Values
            </h2>
            <div className="space-y-1">
                {toggles.sin && <ValueDisplay label="sin(θ)" value={trigValues.sin} color={theme.sin} />}
                {toggles.cos && <ValueDisplay label="cos(θ)" value={trigValues.cos} color={theme.cos} />}
                {toggles.tan && <ValueDisplay label="tan(θ)" value={trigValues.tan} color={theme.tan} />}
                {toggles.cot && <ValueDisplay label="cot(θ)" value={trigValues.cot} color={theme.cot} />}
                {toggles.sec && <ValueDisplay label="sec(θ)" value={trigValues.sec} color={theme.sec} />}
                {toggles.csc && <ValueDisplay label="csc(θ)" value={trigValues.csc} color={theme.csc} />}
            </div>
        </div>
    );
};

export const UnitCircle: React.FC = () => {
    // State
    const [angle, setAngle] = useState(58);
    const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
    const [toggles, setToggles] = useState<UnitCircleState['toggles']>({
        sin: true,
        cos: true,
        tan: false,
        cot: false,
        sec: false,
        csc: false,
        comp: false,
        geoTan: true,
        geoCot: true,
        similarSec: false,
        similarCsc: false,
        hypotenuse: true,
        quadrants: false,
    });

    const [isDragging, setIsDragging] = useState(false);

    // Trace History for Graph
    const [trace, setTrace] = useState<Array<{ angle: number, values: any }>>([]);

    // Dark Mode Detection (Basic system preference)
    const [isDarkMode, setIsDarkMode] = useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Derived Trig Values for UI
    const rad = toRad(angle);
    const trigValues = {
        cos: Math.cos(rad),
        sin: Math.sin(rad),
        tan: Math.tan(rad),
        cot: 1 / Math.tan(rad),
        sec: 1 / Math.cos(rad),
        csc: 1 / Math.sin(rad)
    };

    // Update Trace Helper
    const updateTrace = (newAngle: number) => {
        setTrace(prev => {
            const newPoint = {
                angle: newAngle,
                values: {
                    cos: Math.cos(toRad(newAngle)),
                    sin: Math.sin(toRad(newAngle)),
                    tan: Math.tan(toRad(newAngle)),
                    cot: 1 / Math.tan(toRad(newAngle)),
                    sec: 1 / Math.cos(toRad(newAngle)),
                    csc: 1 / Math.sin(toRad(newAngle))
                }
            };

            const filtered = prev.filter(p => Math.abs(p.angle - newAngle) > 0.1);
            const sorted = [...filtered, newPoint].sort((a, b) => a.angle - b.angle);
            return sorted;
        });
    };

    // Theme Configuration
    const theme = useMemo(() => isDarkMode ? {
        sin: '#ff6b6b', // Softer red
        cos: '#4dabf7', // Softer blue
        tan: '#ff922b', // Softer orange
        cot: '#51cf66', // Softer green
        sec: '#cc5de8', // Softer purple
        csc: '#fcc419', // Softer yellow
        grid: '#343a40', // Dark grid
        axis: '#ced4da', // Light axis
        text: '#f8f9fa', // White text
        bg: '#212529',   // Dark bg
        comp: '#adb5bd'  // Grey for comp
    } : {
        sin: '#e74c3c',
        cos: '#3498db',
        tan: '#e67e22',
        cot: '#27ae60',
        sec: '#8e44ad',
        csc: '#f1c40f',
        grid: '#e1e4e8',
        axis: '#333333',
        text: '#333333',
        bg: '#ffffff',
        comp: '#888888'
    }, [isDarkMode]);

    // Canvas Draw Callback
    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        const width = ctx.canvas.width / window.devicePixelRatio;
        const height = ctx.canvas.height / window.devicePixelRatio;

        drawUnitCircle(ctx, width, height, {
            angle,
            angleUnit,
            toggles,
            theme
        });
    }, [angle, angleUnit, toggles, theme]);

    // Initialize Canvas Hook
    const canvasRef = useCanvas(draw, {
        width: 750, // 1.5x size
        height: 750,
        animate: false
    });

    // Interaction Handlers
    const handleInteraction = (clientX: number, clientY: number, shiftKey: boolean) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Scale coordinates if canvas is displayed at different size than render size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const cx = 750 / 2;
        const cy = 750 / 2;
        const dx = (x * scaleX) - cx;
        const dy = (y * scaleY) - cy;

        let newRad = Math.atan2(-dy, dx);
        if (newRad < 0) newRad += Math.PI * 2;
        let newDeg = toDeg(newRad);

        if (shiftKey) {
            newDeg = Math.round(newDeg / 15) * 15;
        } else {
            newDeg = Math.round(newDeg * 10) / 10;
        }

        const normDeg = normalizeAngle(newDeg);
        setAngle(normDeg);
        updateTrace(normDeg);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY, e.shiftKey);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            handleInteraction(e.clientX, e.clientY, e.shiftKey);
        }
    };

    const onMouseUp = () => setIsDragging(false);

    // Touch Support
    const onTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY, false);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (isDragging) {
            const touch = e.touches[0];
            handleInteraction(touch.clientX, touch.clientY, false);
        }
    };

    const onTouchEnd = () => setIsDragging(false);

    const handleSliderChange = (val: number) => {
        setAngle(val);
        updateTrace(val);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start p-8 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {/* 1. Left Column: Controls */}
            <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col gap-6 order-2 xl:order-1">
                <Controls
                    angle={angle}
                    setAngle={handleSliderChange}
                    angleUnit={angleUnit}
                    setAngleUnit={setAngleUnit}
                    toggles={toggles}
                    setToggles={setToggles}
                />
            </div>

            {/* 2. Center Column: Canvas & Graphs */}
            <div className="flex-grow w-full flex flex-col gap-6 order-1 xl:order-2">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative flex justify-center">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        className="cursor-crosshair touch-none rounded-lg border border-slate-100 dark:border-slate-700 w-full h-auto max-w-[750px]"
                        style={{ touchAction: 'none' }}
                    />
                </div>
                <TrigGraph
                    trace={trace}
                    toggles={toggles}
                    theme={theme}
                    angleUnit={angleUnit}
                    onReset={() => setTrace([])}
                />
            </div>

            {/* 3. Right Column: Lessons & Values */}
            <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6 order-3">
                <LessonPanel
                    toggles={toggles}
                    setToggles={setToggles}
                    setAngle={handleSliderChange}
                />
                {/* Visual Readout can stay here or move left. User asked for "Lesson Panel on right". 
                    Keeping Readout here balances the 3 columns well. */}
                <ReadoutPanel
                    trigValues={trigValues}
                    toggles={toggles}
                    theme={theme}
                />
            </div>
        </div>
    );
};
