import React from 'react';
import { PlayCircle, PauseCircle } from '@phosphor-icons/react';
import { TrigTheme } from '../../types';

interface CanvasHeaderProps {
    angle: number;
    setAngle: (angle: number) => void;
    angleUnit: 'deg' | 'rad';
    setAngleUnit: (unit: 'deg' | 'rad') => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    theme: TrigTheme;
}

/**
 * Floating glass header overlay for global canvas controls.
 * Provides immersive "HUD" experience centered on visualization.
 */
export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
    angle,
    setAngle,
    angleUnit,
    setAngleUnit,
    isPlaying,
    setIsPlaying,
    theme
}) => {
    return (
        <div
            className="glass-header absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-2 py-2 bg-ui-bg-panel/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg transition-colors duration-300"
            style={{
                // Enhanced dark mode contrast
                ...(theme.isDark && {
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.15)'
                })
            }}
        >
            {/* Inner Pill: Play + Slider */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                {/* Play/Pause Button */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`
                        flex items-center justify-center p-0 rounded-full transition-all duration-300 hover:scale-105 active:scale-95
                        ${isPlaying ? 'text-ui-text opacity-50' : 'text-trig-cos shadow-glow'}
                    `}
                    title={isPlaying ? 'Pause animation' : 'Play animation'}
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                    style={!isPlaying ? { boxShadow: '0 0 20px -5px oklch(75% 0.15 260 / 0.6)' } : undefined}
                >
                    {isPlaying ? (
                        <PauseCircle size={42} weight="fill" />
                    ) : (
                        <PlayCircle size={42} weight="fill" />
                    )}
                </button>

                {/* Angle Slider */}
                <div className="relative flex-1 h-8 flex items-center group min-w-[200px] md:min-w-[300px]">
                    <input
                        type="range"
                        min="0"
                        max="360"
                        step="0.1"
                        value={angle}
                        onChange={(e) => setAngle(parseFloat(e.target.value))}
                        className="absolute w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-trig-cos/20 border border-white/30"
                        disabled={isPlaying}
                        aria-label={`Angle slider: ${angleUnit === 'deg' ? angle.toFixed(1) + '°' : (angle * Math.PI / 180).toFixed(2) + ' rad'}`}
                        style={{
                            background: `linear-gradient(to right, var(--color-cos) 0%, var(--color-cos) ${(angle / 360) * 100}%, rgba(255,255,255,0.9) ${(angle / 360) * 100}%, rgba(255,255,255,0.9) 100%)`
                        }}
                    />
                    <style>{`
                        input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: ${theme.isDark ? 'oklch(25% 0.02 260)' : '#ffffff'};
                            border: 3px solid var(--color-cos);
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                            margin-top: 0px;
                        }
                        input[type=range]::-webkit-slider-thumb:hover {
                            transform: scale(1.15);
                            cursor: grab;
                        }
                        input[type=range]:active::-webkit-slider-thumb {
                            cursor: grabbing;
                        }
                        input[type=range]::-moz-range-thumb {
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: ${theme.isDark ? 'oklch(25% 0.02 260)' : '#ffffff'};
                            border: 3px solid var(--color-cos);
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            </div>

            {/* Inner Pill: DEG/RAD Toggle */}
            <div className="flex rounded-full bg-white/10 border border-white/10 p-1 gap-1">
                <button
                    onClick={() => setAngleUnit('deg')}
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${angleUnit === 'deg'
                        ? 'bg-surface-selected text-surface-selected-text shadow-sm'
                        : 'text-ui-text-muted hover:text-ui-text'
                        }`}
                    aria-label="Switch to degrees"
                    aria-pressed={angleUnit === 'deg'}
                >
                    DEG
                </button>
                <button
                    onClick={() => setAngleUnit('rad')}
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${angleUnit === 'rad'
                        ? 'bg-surface-selected text-surface-selected-text shadow-sm'
                        : 'text-ui-text-muted hover:text-ui-text'
                        }`}
                    aria-label="Switch to radians"
                    aria-pressed={angleUnit === 'rad'}
                >
                    RAD
                </button>
            </div>

            {/* Mobile: Responsive stacking handled via media queries below */}
            <style>{`
                @media (max-width: 768px) {
                    .glass-header {
                        flex-wrap: wrap;
                        transform: translateX(-50%) scale(0.9);
                        max-width: 90vw;
                    }
                    .glass-header > div:nth-child(2) {
                        /* Angle slider full width on mobile */
                        flex-basis: 100%;
                        order: 3;
                        min-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};
