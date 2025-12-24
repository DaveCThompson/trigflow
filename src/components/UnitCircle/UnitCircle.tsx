import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { drawUnitCircle, UnitCircleState } from './UnitCircleRenderer';
import { Controls } from './Controls';
import { LessonPanel, LessonId, LESSONS } from './LessonPanel';
import { toRad, toDeg, normalizeAngle } from '../../utils/math';
import { TrigGraph } from '../TrigGraph';
import { DiagramPanel } from './DiagramPanel';
import { ReadoutPanel } from './ReadoutPanel';
import { LIGHT_THEME, DARK_THEME } from '../../theme/colors';
import { ThemeContext } from '../../context/ThemeContext';
import { TrigValues } from '../../types';

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
        geoTan: false,
        geoCot: false,
        similarSec: false,
        similarCsc: false,
        hypotenuse: true,
        quadrants: false,
        showXY: false,
        axesIntersections: false,
    });

    // Lesson State
    const [selectedLessonId, setSelectedLessonId] = useState<LessonId>('unit_circle');

    const [isDragging, setIsDragging] = useState(false);

    // Play/Animation State
    const [isPlaying, setIsPlaying] = useState(false);
    const ANIMATION_SPEED = 0.5; // degrees per frame (~30 deg/sec at 60fps)

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) return;
        let animationId: number;
        const animate = () => {
            setAngle(prev => {
                const next = prev + ANIMATION_SPEED;
                const normalized = next >= 360 ? 0 : next;
                updateTrace(normalized);
                return normalized;
            });
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying]);

    // Trace History for Graph
    const [trace, setTrace] = useState<Array<{ angle: number, values: TrigValues }>>([]);

    // Dark Mode Detection (Basic system preference)
    const [isDarkMode, setIsDarkMode] = useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    setIsPlaying(p => !p);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setAngle(a => {
                        const newAngle = (a - 5 + 360) % 360;
                        updateTrace(newAngle);
                        return newAngle;
                    });
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    setAngle(a => {
                        const newAngle = (a + 5) % 360;
                        updateTrace(newAngle);
                        return newAngle;
                    });
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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

    // Theme Configuration (using centralized theme)
    const theme = useMemo(() => isDarkMode ? DARK_THEME : LIGHT_THEME, [isDarkMode]);

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

    // Reset all toggles to defaults
    const resetToggles = useCallback(() => {
        setToggles({
            sin: false, cos: false, tan: false, cot: false, sec: false, csc: false,
            comp: false, geoTan: false, geoCot: false, similarSec: false, similarCsc: false,
            hypotenuse: false, quadrants: false, showXY: false, axesIntersections: false,
        });
    }, []);

    const handleSliderChange = (val: number) => {
        setAngle(val);
        updateTrace(val);
    };

    // Determine Diagram Mode
    const currentLesson = LESSONS.find(l => l.id === selectedLessonId);
    const showDiagram = currentLesson && currentLesson.diagram !== 'none';

    return (
        <ThemeContext.Provider value={theme}>
            <div className="flex flex-col xl:flex-row gap-6 items-start p-8 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
                {/* 1. Left Column: Lessons */}
                <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6 order-2 xl:order-1">
                    <LessonPanel
                        toggles={toggles}
                        setToggles={setToggles}
                        selectedLessonId={selectedLessonId}
                        onLessonChange={setSelectedLessonId}
                        theme={theme}
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
                        currentAngle={angle}
                    />
                </div>

                {/* 3. Right Column: Controls OR Diagram */}
                <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col gap-6 order-3">
                    {showDiagram ? (
                        <DiagramPanel
                            type={currentLesson!.diagram}
                            setToggles={setToggles}
                        />
                    ) : (
                        <>
                            <Controls
                                angle={angle}
                                setAngle={handleSliderChange}
                                angleUnit={angleUnit}
                                setAngleUnit={setAngleUnit}
                                toggles={toggles}
                                setToggles={setToggles}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                theme={theme}
                                onResetToggles={resetToggles}
                            />
                            <ReadoutPanel
                                trigValues={trigValues}
                                toggles={toggles}
                                theme={theme}
                            />
                        </>
                    )}
                </div>
            </div>
        </ThemeContext.Provider>
    );
};
