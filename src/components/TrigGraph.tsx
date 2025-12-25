import React, { useRef, useEffect } from 'react';
import { UnitCircleState, TrigValues } from '../types';
import { mapRange, toRad } from '../utils/math';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

interface TrigGraphProps {
    trace: Array<{ angle: number, values: TrigValues }>;
    toggles: UnitCircleState['toggles'];
    theme: UnitCircleState['theme'];
    angleUnit: 'deg' | 'rad';
    onReset: () => void;
    currentAngle: number;
}

const SingleGraph: React.FC<{
    dataKey: keyof TrigValues;
    label: string;
    color: string;
    trace: TrigGraphProps['trace'];
    theme: UnitCircleState['theme'];
    angleUnit: 'deg' | 'rad';
    currentAngle: number;
}> = ({ dataKey, label, color, trace, theme, angleUnit, currentAngle }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;

        // Clear (Transparent to let CSS gradient show through, or use explicit transparent fill)
        ctx.clearRect(0, 0, W, H);
        // Note: We are relying on the CSS bg-canvas-gradient for the background color now.
        // But for Axes and Grid we need to draw on top.

        // Config
        const PADDING_TOP = 15;
        const PADDING_BOTTOM = 25;
        const PADDING_LEFT = 35; // Space for Y-axis labels
        const PADDING_RIGHT = 15;

        const GRAPH_W = W - PADDING_LEFT - PADDING_RIGHT;

        // Y-Axis Range
        const isBounded = dataKey === 'sin' || dataKey === 'cos';
        const Y_RANGE = isBounded ? 1.1 : 10;

        const mapX = (deg: number) => mapRange(deg, 0, 360, PADDING_LEFT, PADDING_LEFT + GRAPH_W);
        const mapY = (val: number) => mapRange(val, -Y_RANGE, Y_RANGE, H - PADDING_BOTTOM, PADDING_TOP);

        // Grid
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = theme.grid;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);

        let displayY = [1, -1];
        if (!isBounded) displayY = [10, -10];

        displayY.forEach(val => {
            const y = mapY(val);
            ctx.moveTo(PADDING_LEFT, y);
            ctx.lineTo(W - PADDING_RIGHT, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Axes
        ctx.beginPath();
        const y0 = mapY(0);
        ctx.moveTo(PADDING_LEFT, y0);
        ctx.lineTo(W - PADDING_RIGHT, y0);

        const x0 = mapX(0);
        ctx.moveTo(x0, PADDING_TOP);
        ctx.lineTo(x0, H - PADDING_BOTTOM);
        ctx.stroke();

        // Current Angle Indicator
        ctx.beginPath();
        ctx.strokeStyle = theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        const currentX = mapX(currentAngle);
        ctx.moveTo(currentX, PADDING_TOP);
        ctx.lineTo(currentX, H - PADDING_BOTTOM);
        ctx.stroke();
        ctx.setLineDash([]);

        // Text Styles (JetBrains Mono)
        // Text Styles (JetBrains Mono)
        // Text Styles (JetBrains Mono)
        ctx.fillStyle = theme.label_primary; // High contrast Slate from Theme
        ctx.font = "500 11px 'JetBrains Mono', monospace"; // Bump weight and size slightly
        ctx.textAlign = "center";

        // X-Axis Labels
        // Skip 90/270 for cleaner look in small graph? No, show all.
        [0, 180, 360].forEach(deg => {
            const labelTxt = angleUnit === 'rad'
                ? (deg === 0 ? "0" : (deg === 180 ? "π" : "2π"))
                : deg + "°";
            ctx.fillText(labelTxt, mapX(deg), H - 5);
        });

        // Y-Axis Labels
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const yLabels = isBounded ? [1, 0, -1] : [10, 0, -10];

        yLabels.forEach(val => {
            const y = mapY(val);
            let str = val.toString();
            if (val > 0) str = "+" + str;
            ctx.fillText(str, PADDING_LEFT - 6, y);
        });

        // Trace Plot
        if (trace.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.0; // Finer line

            let first = true;
            const sorted = [...trace].sort((a, b) => a.angle - b.angle);

            for (const pt of sorted) {
                const x = mapX(pt.angle);
                const val = pt.values[dataKey];

                if (Math.abs(val) > Y_RANGE) {
                    first = true;
                    continue;
                }
                const y = mapY(val);

                if (first) {
                    ctx.moveTo(x, y);
                    first = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // Current Value Dot
        const currentRad = toRad(currentAngle);
        let currentVal = 0;
        if (dataKey === 'sin') currentVal = Math.sin(currentRad);
        else if (dataKey === 'cos') currentVal = Math.cos(currentRad);
        else if (dataKey === 'tan') currentVal = Math.tan(currentRad);
        else if (dataKey === 'cot') currentVal = 1 / Math.tan(currentRad);
        else if (dataKey === 'sec') currentVal = 1 / Math.cos(currentRad);
        else if (dataKey === 'csc') currentVal = 1 / Math.sin(currentRad);

        if (Math.abs(currentVal) <= Y_RANGE) {
            const dotX = mapX(currentAngle);
            const dotY = mapY(currentVal);

            ctx.beginPath();
            ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = theme.canvas_dot_bg;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();

            // Canvas dots now use theme-aware background color
            // that matches the panel background in each mode
        }

    }, [trace, theme, angleUnit, color, dataKey, currentAngle]);

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-center px-1 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide opacity-80" style={{ color }}>{label}</span>
            </div>
            {/* Added bg-canvas-gradient here */}
            <canvas
                ref={canvasRef}
                className="w-full h-[120px] rounded-2xl border border-ui-border bg-canvas-bg shadow-sm"
            />
        </div>
    );
};

export const TrigGraph: React.FC<TrigGraphProps> = ({ trace, toggles, theme, angleUnit, onReset, currentAngle }) => {
    // Collect active graphs
    const activeGraphs = [];
    if (toggles.sin) activeGraphs.push({ key: 'sin', label: 'Sine', color: theme.sin });
    if (toggles.cos) activeGraphs.push({ key: 'cos', label: 'Cosine', color: theme.cos });
    if (toggles.tan) activeGraphs.push({ key: 'tan', label: 'Tangent', color: theme.tan });
    if (toggles.cot) activeGraphs.push({ key: 'cot', label: 'Cotangent', color: theme.cot });
    if (toggles.sec) activeGraphs.push({ key: 'sec', label: 'Secant', color: theme.sec });
    if (toggles.csc) activeGraphs.push({ key: 'csc', label: 'Cosecant', color: theme.csc });

    return (
        <div className="mt-8 w-full">
            <div className="flex justify-between items-center mb-4 border-b border-ui-border pb-2">
                <h3 className="text-sm font-bold text-ui-text-muted uppercase tracking-wider">Graphs</h3>
                <button
                    onClick={onReset}
                    className="text-xs flex items-center gap-1 px-2.5 py-1.5 bg-ui-bg-hover rounded-lg text-ui-text-muted hover:text-ui-text transition-colors"
                >
                    <ArrowCounterClockwise className="text-sm" />
                    Reset
                </button>
            </div>

            <div className="space-y-6">
                {activeGraphs.length === 0 && (
                    <div className="text-center text-ui-text-muted py-8 text-sm italic border-2 border-dashed border-ui-border rounded-2xl">
                        Toggle functions to see graphs
                    </div>
                )}
                {activeGraphs.map(g => (
                    <SingleGraph
                        key={g.key}
                        dataKey={g.key as keyof TrigValues}
                        label={g.label}
                        color={g.color}
                        trace={trace}
                        theme={theme}
                        angleUnit={angleUnit}
                        currentAngle={currentAngle}
                    />
                ))}
            </div>
        </div>
    );
};
